const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { FormData, File, fetch } = require('undici');

class TesboUploaderV2 {
  constructor(options = {}) {
    this.apiKey = options.apiKey;
    this.apiKeyEnv = options.apiKeyEnv || 'TESBO_API_KEY';
    this.reportingPortalUrlEnv = options.reportingPortalUrlEnv || 'TESBO_REPORTING_PORTAL_URL';
    this.reportingPortalUrl = options.reportingPortalUrl || options.baseUrl || 'https://app.tesbo.io/api';
    this.runTitle = options.runTitle;

    this.expectedTestCount = 0;
    this.runPromise = null;
    this.startedAt = null;
    this.uploads = [];
    this.uploadedKeys = new Set();
    this.uploadedStatusCounts = { PASSED: 0, FAILED: 0, SKIPPED: 0 };
    this.testRecords = new Map(); // key -> { test, result }
    this.skippedKeys = new Set();
    this._baseUrlInfoLogged = false;
  }

  onBegin(config, suite) {
    this.expectedTestCount = typeof suite.allTests === 'function' ? suite.allTests().length : 0;
    this.startedAt = new Date();
    this.runPromise = this._ensureRun(); // kick off run creation ASAP for live uploads
    this._scheduleSkippedUploads(suite);
  }

  onTestEnd(test, result) {
    const key = this._testKey(test, result);
    this.testRecords.set(key, { test, result });
    const upload = this._uploadTest(test, result, key).catch(err => {
      console.error(`[tesbo-uploader-v2] Upload failed for ${test.title}:`, err?.message || err);
    });
    this.uploads.push(upload);
    return upload;
  }

  async onEnd() {
    await this._ensureRun();
    if (this.uploads.length) {
      await Promise.allSettled(this.uploads);
    }

    // Best-effort reconciliation: retry any in-memory missing uploads.
    const missing = this.expectedTestCount - this.uploadedKeys.size;
    if (missing > 0) {
      console.warn(`[tesbo-uploader-v2] ⚠️  Detected ${missing} test(s) not yet uploaded. Retrying missing items before completing the run.`);
      for (const [key, record] of this.testRecords.entries()) {
        if (this.uploadedKeys.has(key)) continue;
        console.log(`[tesbo-uploader-v2] Retrying upload for missing test: ${key}`);
        await this._uploadTest(record.test, record.result, key);
      }
    }

    // Ensure all scheduled skipped tests were sent.
    const missingSkipped = [...this.skippedKeys].filter(k => !this.uploadedKeys.has(k));
    if (missingSkipped.length) {
      console.warn(`[tesbo-uploader-v2] ⚠️  Retrying ${missingSkipped.length} skipped test upload(s) before completing run.`);
      for (const key of missingSkipped) {
        const record = this.testRecords.get(key);
        if (!record) {
          console.warn(`[tesbo-uploader-v2] ⚠️  Missing skipped test record; cannot re-upload: ${key}`);
          continue;
        }
        await this._uploadTest(record.test, record.result, key);
      }
    }

    // Final reconciliation against Playwright json report for counts and missing tests.
    await this._reconcileWithJsonTotals();

    await this._completeRun();
  }

  _resolveApiKey() {
    return this.apiKey || process.env[this.apiKeyEnv];
  }

  _resolveBaseUrl() {
    const fromEnv = process.env[this.reportingPortalUrlEnv];
    const fromLegacy = process.env.TESBO_BASE_URL;
    const base = fromEnv || fromLegacy || this.reportingPortalUrl || '';
    const cleaned = base.replace(/\/$/, '');

    if (!this._baseUrlInfoLogged) {
      const source = fromEnv
        ? `env:${this.reportingPortalUrlEnv}`
        : fromLegacy
          ? 'env:TESBO_BASE_URL'
          : 'config:reportingPortalUrl';
      console.log(`[tesbo-uploader-v2] Using reporting base URL: "${cleaned || '(empty)'}" (source: ${source})`);
      if (fromEnv || fromLegacy) {
        console.log('[tesbo-uploader-v2] Note: env vars override config reportingPortalUrl. Clear them to use config value.');
      }
      this._baseUrlInfoLogged = true;
    }

    return cleaned;
  }

  _resolveRunTitle() {
    return this.runTitle
      || process.env.TESBO_RUN_TITLE
      || process.env.GITHUB_REF
      || process.env.CI_COMMIT_REF_NAME
      || 'Playwright Run';
  }

  _clean(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null));
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async _ensureRun() {
    if (this.runPromise) {
      return this.runPromise;
    }
    this.runPromise = this._createRun();
    return this.runPromise;
  }

  async _createRun() {
    const apiKey = this._resolveApiKey();
    if (!apiKey) {
      console.warn(`[tesbo-uploader-v2] ❌ Skipping run creation: missing apiKey and env ${this.apiKeyEnv}`);
      return null;
    }

    const baseUrl = this._resolveBaseUrl();
    const url = `${baseUrl}/ingest/playwright/runs`;
    const payload = this._clean({
      name: this._resolveRunTitle(),
      expectedTestCount: this.expectedTestCount || undefined,
      branchName: process.env.GITHUB_REF_NAME || process.env.CI_COMMIT_REF_NAME,
      pullRequest: process.env.GITHUB_PR_NUMBER || process.env.CI_MERGE_REQUEST_IID,
      commitAuthor: process.env.GITHUB_ACTOR || process.env.CI_COMMIT_AUTHOR,
      githubRunId: process.env.GITHUB_RUN_ID || process.env.CI_PIPELINE_ID,
      startedAt: this.startedAt ? this.startedAt.toISOString() : undefined
    });

    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`[tesbo-uploader-v2] Creating run at ${url} with payload:`, payload);
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey
          },
          body: JSON.stringify(payload)
        });

        const body = await res.text();
        const requestId = res.headers.get('x-request-id') || res.headers.get('x-correlation-id');
        
        console.log(`[tesbo-uploader-v2] Run create response status: ${res.status} ${res.statusText}`);
        if (requestId) {
          console.log(`[tesbo-uploader-v2] Run create request id: ${requestId}`);
        }
        console.log(`[tesbo-uploader-v2] Run create response body: ${body}`);
        console.log(`[tesbo-uploader-v2] Run create response headers: ${JSON.stringify(Object.fromEntries(res.headers.entries()))}`);
        
        if (!res.ok) {
          console.error(`[tesbo-uploader-v2] ❌ Run creation failed (${res.status} ${res.statusText}): ${body}`);
          console.error(`[tesbo-uploader-v2] ❌ Request was: POST ${url}`);
          console.error(`[tesbo-uploader-v2] ❌ Payload was: ${JSON.stringify(payload)}`);
          return null;
        }

        const parsed = this._safeJson(body);
        if (parsed === undefined) {
          console.warn('[tesbo-uploader-v2] ⚠️ Run create response was not valid JSON; raw body returned above');
        } else {
          console.log('[tesbo-uploader-v2] Run create parsed response:', parsed);
        }

        const runId = parsed?.runId;
        if (!runId) {
          console.error('[tesbo-uploader-v2] ❌ Run creation succeeded but runId missing in response.');
          console.error(`[tesbo-uploader-v2] ❌ Response was: ${body}`);
          return null;
        }

        console.log(`[tesbo-uploader-v2] ✅ Run created: ${runId}`);
        return runId;
      } catch (err) {
        const cause = err?.cause || {};
        const detail = JSON.stringify({
          code: cause.code,
          errno: cause.errno,
          syscall: cause.syscall,
          address: cause.address,
          port: cause.port,
          host: cause.host
        });
        console.error(`[tesbo-uploader-v2] ❌ Run creation error (attempt ${attempt}/${maxAttempts}):`, err?.message || err);
        console.error('[tesbo-uploader-v2] ❌ Error stack:', err?.stack);
        if (cause && (cause.code || cause.errno)) {
          console.error(`[tesbo-uploader-v2] ❌ Network detail: ${detail}`);
        }
        if (attempt < maxAttempts) {
          const backoffMs = 500 * attempt;
          console.log(`[tesbo-uploader-v2] Retrying run creation in ${backoffMs}ms...`);
          await this._delay(backoffMs);
          continue;
        }
        console.error('[tesbo-uploader-v2] ❌ Exhausted retries for run creation; giving up.');
        return null;
      }
    }
  }

  async _uploadTest(test, result, providedKey) {
    const apiKey = this._resolveApiKey();
    if (!apiKey) {
      console.warn('[tesbo-uploader-v2] ⚠️  Skipping test upload: missing API key.');
      return;
    }

    const runId = await this._ensureRun();
    if (!runId) {
      console.warn('[tesbo-uploader-v2] ⚠️  Skipping test upload: run was not created. Check run creation logs above.');
      return;
    }

    const baseUrl = this._resolveBaseUrl();
    const url = `${baseUrl}/ingest/playwright/runs/${runId}/tests`;
    const payload = this._clean({
      specName: this._specName(test, result),
      testName: test?.title,
      fullTitle: this._fullTitle(test),
      status: this._mapStatus(result?.status),
      durationMs: result?.duration,
      errorMessage: this._errorMessage(result),
      errorStack: this._errorStack(result),
      attempt: result?.retry ?? 0,
      tags: this._tags(test),
      steps: this._steps(result)
    });

    const artifacts = await this._collectArtifacts(result);
    const artifactSummary = artifacts.map(a => `${a.kind}:${path.basename(a.filePath)}`).join(', ') || 'none';
    const artifactPaths = artifacts.map(a => `${a.kind}:${a.filePath}`).join(', ') || 'none';
    const artifactSizes = await this._artifactSizes(artifacts);
    if (artifactSizes.length) {
      console.log('[tesbo-uploader-v2] Artifact sizes (bytes):', artifactSizes);
    }

    const key = providedKey || this._testKey(test, result);
    let attempt = 1;
    while (true) {
      const form = await this._buildForm(payload, artifacts);
      this._logFormEntries(form);
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'X-API-Key': apiKey,
            'Idempotency-Key': this._idempotencyKey(runId, payload)
          },
          body: form
        });
        const body = await res.text();
        const requestId = res.headers.get('x-request-id') || res.headers.get('x-correlation-id');
        if (requestId) {
          console.log(`[tesbo-uploader-v2] Test upload request id: ${requestId}`);
          console.log(`[tesbo-uploader-v2] Response headers: request-id=${requestId}`);
        }
        const parsed = this._safeJson(body);
        console.log(`[tesbo-uploader-v2] Test upload response (${res.status}): raw=${body}`);
        console.log('[tesbo-uploader-v2] Test upload response parsed:', parsed);
        console.log(`[tesbo-uploader-v2] Artifacts sent: ${artifactSummary}`);
        console.log(`[tesbo-uploader-v2] Artifact paths: ${artifactPaths}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText || ''}`.trim());
        }
        console.log(`[tesbo-uploader-v2] ✅ Uploaded test ${payload.fullTitle || payload.testName} -> ${body}`);
        this.uploadedKeys.add(key);
        const status = payload.status || this._mapStatus(result?.status);
        if (status && this.uploadedStatusCounts[status] !== undefined) {
          this.uploadedStatusCounts[status] += 1;
        }
        return;
      } catch (err) {
        const backoffMs = Math.min(30000, 1000 * attempt);
        console.error(`[tesbo-uploader-v2] ❌ Test upload error (attempt ${attempt}):`, err?.message || err);
        if (err?.stack) {
          console.error('[tesbo-uploader-v2] ❌ Error stack:', err.stack);
        }
        console.log(`[tesbo-uploader-v2] Retrying test upload in ${backoffMs}ms...`);
        await this._delay(backoffMs);
        attempt += 1;
      }
    }
  }

  async _completeRun() {
    const apiKey = this._resolveApiKey();
    if (!apiKey) {
      console.warn('[tesbo-uploader-v2] ⚠️  Skipping run completion: missing API key.');
      return;
    }

    const runId = await this.runPromise;
    if (!runId) {
      console.warn('[tesbo-uploader-v2] ⚠️  Skipping run completion: run was not created.');
      console.warn('[tesbo-uploader-v2] ⚠️  Check the run creation logs above to see why it failed.');
      console.warn('[tesbo-uploader-v2] ⚠️  Common causes: expired JWT token, invalid API key, server connection issues, SSL certificate problems.');
      return;
    }

    const baseUrl = this._resolveBaseUrl();
    const url = `${baseUrl}/ingest/playwright/runs/${runId}/complete`;
    // API accepts an empty POST body; sending JSON currently results in a 400.
    try {
      console.log(`[tesbo-uploader-v2] Completing run ${runId} at ${url}`);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'X-API-Key': apiKey }
      });
      const body = await res.text();
      const requestId = res.headers.get('x-request-id') || res.headers.get('x-correlation-id');
      
      console.log(`[tesbo-uploader-v2] Run complete response status: ${res.status} ${res.statusText}`);
      if (requestId) {
        console.log(`[tesbo-uploader-v2] Run complete request id: ${requestId}`);
      }
      
      if (!res.ok) {
        console.error(`[tesbo-uploader-v2] ❌ Run completion failed (${res.status} ${res.statusText}): ${body}`);
      } else {
        console.log(`[tesbo-uploader-v2] ✅ Run ${runId} completed: ${body}`);
      }
    } catch (err) {
      console.error('[tesbo-uploader-v2] ❌ Run completion error:', err?.message || err);
      console.error('[tesbo-uploader-v2] ❌ Error stack:', err?.stack);
    }
  }

  _specName(test, result) {
    const file = test?.location?.file;
    const relative = file ? path.relative(process.cwd(), file) : test?.title || 'unknown-spec';
    const project = this._projectName(test, result);
    const suffix = project ? ` [${project}]` : '';
    return `${relative}${suffix}`;
  }

  _projectName(test, result) {
    // Prefer API helpers if present.
    const direct =
      (typeof test?.project === 'function' && test.project()?.name)
      || test?.projectName
      || result?.projectName
      || result?.workerInfo?.projectName
      || result?.workerInfo?.project?.name;
    if (direct) return direct;

    // Derive from outputDir (e.g., artifacts/test-results/<name>-chromium).
    const fromOutputDir = this._projectFromPath(result?.outputDir);
    if (fromOutputDir) return fromOutputDir;

    // Derive from attachment paths.
    const attachments = Array.isArray(result?.attachments) ? result.attachments : [];
    for (const att of attachments) {
      const candidate = this._projectFromPath(att?.path);
      if (candidate) return candidate;
    }

    return undefined;
  }

  _projectFromPath(p) {
    if (!p || typeof p !== 'string') return undefined;
    const parts = p.split(path.sep).filter(Boolean).reverse();
    for (const part of parts) {
      const match = part.match(/(?:^|[-_])(chromium|firefox|webkit)(?:$|[^a-z])/i);
      if (match) return match[1].toLowerCase();
    }
    return undefined;
  }

  _safeJson(text) {
    try {
      return JSON.parse(text);
    } catch {
      return undefined;
    }
  }

  async _artifactSizes(artifacts) {
    const out = [];
    for (const a of artifacts) {
      try {
        const st = await fs.promises.stat(a.filePath);
        out.push({ kind: a.kind, bytes: st.size });
      } catch (err) {
        out.push({ kind: a.kind, error: err?.message || 'stat failed' });
      }
    }
    return out;
  }

  _fullTitle(test) {
    if (test && typeof test.titlePath === 'function') {
      const parts = test.titlePath().filter(Boolean);
      if (parts.length) return parts.join(' > ');
    }
    return test?.title || 'Test';
  }

  _mapStatus(status) {
    if (status === 'passed') return 'PASSED';
    if (status === 'skipped') return 'SKIPPED';
    return 'FAILED';
  }

  _errorMessage(result) {
    return result?.error?.message
      || (Array.isArray(result?.errors) && result.errors[0]?.message)
      || undefined;
  }

  _errorStack(result) {
    return result?.error?.stack
      || (Array.isArray(result?.errors) && result.errors[0]?.stack)
      || undefined;
  }

  _tags(test) {
    if (!test?.annotations) return undefined;
    const tags = test.annotations
      .map(a => a?.type || a?.description)
      .filter(Boolean);
    return tags.length ? tags : undefined;
  }

  _steps(result) {
    if (!Array.isArray(result?.steps)) return undefined;
    const steps = result.steps.map(step => this._clean({
      description: step?.title,
      status: step?.error ? 'FAILED' : 'PASSED',
      durationMs: step?.duration
    }));
    return steps.length ? steps : undefined;
  }

  _testKey(test, result) {
    const spec = this._specName(test, result);
    const title = this._fullTitle(test);
    const attempt = result?.retry ?? 0;
    return `${spec}::${title}::${attempt}`;
  }

  _scheduleSkippedUploads(suite) {
    if (!suite || typeof suite.allTests !== 'function') return;
    const tests = suite.allTests();
    for (const test of tests) {
      if (!this._isSkippedTest(test)) continue;
      const projectName = this._projectNameFromTest(test) || 'unknown-project';
      const key = this._testKey(test, { retry: 0, projectName });
      if (this.testRecords.has(key)) continue; // already tracked
      const fakeResult = {
        status: 'skipped',
        duration: 0,
        attachments: [],
        errors: [],
        error: undefined,
        retry: 0,
        projectName,
        workerInfo: { projectName, project: { name: projectName } },
        steps: []
      };
      this.testRecords.set(key, { test, result: fakeResult });
      this.skippedKeys.add(key);
      const upload = this._uploadTest(test, fakeResult, key).catch(err => {
        console.error(`[tesbo-uploader-v2] Upload failed for skipped test ${test.title}:`, err?.message || err);
      });
      this.uploads.push(upload);
    }
  }

  _isSkippedTest(test) {
    if (test?.expectedStatus === 'skipped') return true;
    if (Array.isArray(test?.annotations)) {
      return test.annotations.some(a => {
        const t = (a?.type || a?.description || '').toLowerCase();
        return t === 'skip' || t === 'skipped' || t === 'fixme';
      });
    }
    return false;
  }

  _projectNameFromTest(test) {
    if (!test) return undefined;
    if (typeof test.project === 'function') {
      const proj = test.project();
      if (proj?.name) return proj.name;
    }
    return test.projectName || test.projectId || undefined;
  }

  async _reconcileWithJsonTotals() {
    const jsonPath = path.join(process.cwd(), 'test-results.json');
    const exists = await this._fileExists(jsonPath);
    if (!exists) {
      console.log('[tesbo-uploader-v2] JSON report not found; skipping final reconciliation.');
      return;
    }

    let data;
    try {
      const raw = await fs.promises.readFile(jsonPath, 'utf-8');
      data = JSON.parse(raw);
    } catch (err) {
      console.warn('[tesbo-uploader-v2] ⚠️  Failed to read/parse test-results.json:', err?.message || err);
      return;
    }

    const jsonTests = this._extractJsonTests(data);
    const totals = { PASSED: 0, FAILED: 0, SKIPPED: 0 };
    const missingByStatus = { PASSED: [], FAILED: [], SKIPPED: [] };

    for (const jt of jsonTests) {
      const status = this._mapStatus(jt.status || jt.expectedStatus);
      if (!status) continue;
      totals[status] = (totals[status] || 0) + 1;
      const key = this._jsonTestKey(jt, data?.config);
      if (!this.uploadedKeys.has(key)) {
        missingByStatus[status].push({ key, jt });
      }
    }

    const uploaded = this.uploadedStatusCounts;
    const mismatches = [];
    for (const s of ['PASSED', 'FAILED', 'SKIPPED']) {
      if ((totals[s] || 0) !== (uploaded[s] || 0)) {
        mismatches.push(s);
      }
    }

    if (!mismatches.length) {
      console.log('[tesbo-uploader-v2] Final reconciliation: counts match json report.');
      return;
    }

    console.warn(`[tesbo-uploader-v2] ⚠️ Final reconciliation mismatch. json totals: ${JSON.stringify(totals)}, uploaded: ${JSON.stringify(uploaded)}`);

    for (const s of mismatches) {
      const list = missingByStatus[s] || [];
      if (!list.length) continue;
      console.warn(`[tesbo-uploader-v2] ⚠️ Re-uploading ${list.length} missing ${s} test(s) from json report.`);
      for (const item of list) {
        const { key, jt } = item;
        if (this.uploadedKeys.has(key)) continue;
        const record = this.testRecords.get(key);
        if (record) {
          await this._uploadTest(record.test, record.result, key);
          continue;
        }
        const synth = this._buildSyntheticFromJson(jt, data?.config);
        await this._uploadTest(synth.test, synth.result, key);
      }
    }
  }

  _extractJsonTests(json) {
    const out = [];
    const rootDir = json?.config?.rootDir || process.cwd();

    const walkSuite = (suite, inheritedFile) => {
      const suiteFile = suite?.file || inheritedFile;
      if (Array.isArray(suite?.specs)) {
        for (const spec of suite.specs) {
          walkSpec(spec, suiteFile);
        }
      }
      if (Array.isArray(suite?.suites)) {
        for (const child of suite.suites) {
          walkSuite(child, suiteFile);
        }
      }
    };

    const walkSpec = (spec, inheritedFile) => {
      const specFile = spec?.file || inheritedFile;
      if (Array.isArray(spec?.tests)) {
        for (const test of spec.tests) {
          out.push({ ...test, file: specFile, title: test?.title || spec?.title, titlePath: test?.titlePath || spec?.titlePath });
        }
      }
      if (Array.isArray(spec?.suites)) {
        for (const child of spec.suites) {
          walkSuite(child, specFile);
        }
      }
    };

    if (Array.isArray(json?.suites)) {
      for (const suite of json.suites) {
        walkSuite(suite, suite?.file);
      }
    }

    return out.map(t => {
      const filePath = t?.file
        ? path.isAbsolute(t.file)
          ? t.file
          : path.join(rootDir, t.file)
        : undefined;
      return { ...t, __absFile: filePath };
    });
  }

  _jsonTestKey(testNode, config) {
    if (!testNode) return undefined;
    const spec = this._jsonSpecName(testNode, config);
    const title = this._jsonFullTitle(testNode);
    const attempt = Array.isArray(testNode.results) && testNode.results.length
      ? testNode.results[0]?.retry ?? 0
      : 0;
    return `${spec}::${title}::${attempt}`;
  }

  _jsonSpecName(testNode, config) {
    const rootDir = config?.rootDir || process.cwd();
    const abs = testNode.__absFile
      || (testNode.file
        ? path.isAbsolute(testNode.file) ? testNode.file : path.join(rootDir, testNode.file)
        : undefined);
    const relative = abs ? path.relative(process.cwd(), abs) : (testNode.file || 'unknown-spec');
    const project = testNode.projectName || testNode.projectId;
    const suffix = project ? ` [${project}]` : '';
    return `${relative}${suffix}`;
  }

  _jsonFullTitle(testNode) {
    if (Array.isArray(testNode.titlePath) && testNode.titlePath.length) {
      return testNode.titlePath.filter(Boolean).join(' > ');
    }
    if (testNode.title) return testNode.title;
    return 'Test';
  }

  _buildSyntheticFromJson(testNode, config) {
    const projectName = testNode.projectName || testNode.projectId || 'unknown-project';
    const fakeTest = {
      title: testNode.title || 'Test',
      titlePath: () => (Array.isArray(testNode.titlePath) ? testNode.titlePath : [testNode.title].filter(Boolean)),
      location: { file: testNode.__absFile || testNode.file },
      projectName,
      project: () => ({ name: projectName })
    };
    const status = this._mapStatus(testNode.status || testNode.expectedStatus) || 'SKIPPED';
    const duration = Array.isArray(testNode.results) && testNode.results.length ? testNode.results[0]?.duration : 0;
    const retry = Array.isArray(testNode.results) && testNode.results.length ? testNode.results[0]?.retry ?? 0 : 0;
    const fakeResult = {
      status: status.toLowerCase(),
      duration,
      attachments: [],
      errors: [],
      error: undefined,
      retry,
      projectName,
      workerInfo: { projectName, project: { name: projectName } },
      steps: []
    };
    return { test: fakeTest, result: fakeResult };
  }

  async _collectArtifacts(result) {
    const attachments = Array.isArray(result?.attachments) ? result.attachments : [];
    console.log(`[tesbo-uploader-v2] Processing ${attachments.length} attachments from test result`);
    
    const picked = { trace: null, screenshot: null, video: null };

    for (const att of attachments) {
      const kind = this._detectKind(att?.name || '', att?.contentType || '', att?.path || '');
      console.log(`[tesbo-uploader-v2] Attachment detected: name="${att?.name}", contentType="${att?.contentType}", path="${att?.path}" => kind="${kind}"`);
      if (!kind || !att?.path) continue;
      picked[kind] = att.path; // keep last occurrence for each kind
    }

    const artifacts = [];
    for (const kind of ['trace', 'screenshot', 'video']) {
      const filePath = picked[kind];
      if (!filePath) {
        console.log(`[tesbo-uploader-v2] No ${kind} attachment found for this test`);
        continue;
      }
      const exists = await this._fileExists(filePath);
      if (exists) {
        artifacts.push({ kind, filePath });
        console.log(`[tesbo-uploader-v2] ✓ ${kind} file exists and will be uploaded: ${filePath}`);
      } else {
        console.warn(`[tesbo-uploader-v2] ✗ Skipping ${kind} at ${filePath}: file missing`);
      }
    }
    return artifacts;
  }

  async _buildForm(payload, artifacts) {
    const form = new FormData();
    form.set('test', JSON.stringify(payload));

    for (const { kind, filePath } of artifacts) {
      await this._attachFile(form, kind, filePath);
    }
    return form;
  }

  _logFormEntries(form) {
    const entries = [];
    for (const [key, value] of form.entries()) {
      if (value instanceof File) {
        entries.push(`${key}:${value.name} (${value.type}, ${value.size} bytes)`);
      } else {
        entries.push(`${key}:${typeof value}`);
      }
    }
    console.log(`[tesbo-uploader-v2] FormData entries being sent: ${entries.join(', ')}`);
  }

  _detectKind(name, contentType, filePath) {
    const ext = path.extname(filePath || '').toLowerCase();
    const loweredName = (name || '').toLowerCase();
    const loweredType = (contentType || '').toLowerCase();
    if (ext === '.zip' || loweredType.includes('zip') || loweredName.includes('trace')) return 'trace';
    if (loweredType.startsWith('image/') || loweredName.includes('screenshot') || ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
      return 'screenshot';
    }
    if (loweredType.startsWith('video/') || loweredName.includes('video') || ['.webm', '.mp4', '.mov', '.mkv'].includes(ext)) {
      return 'video';
    }
    return null;
  }

  async _attachFile(form, kind, filePath) {
    try {
      const buf = await fs.promises.readFile(filePath);
      const { filename, mime } = this._buildFileMeta(filePath, kind);
      form.set(kind, new File([buf], filename, { type: mime }));
      console.log(`[tesbo-uploader-v2] ✓ Attached ${kind}: ${filePath} (${mime}, ${buf.length} bytes, field="${kind}", filename="${filename}")`);
    } catch (err) {
      console.warn(`[tesbo-uploader-v2] ✗ Unable to attach ${kind} ${filePath}: ${err?.message || err}`);
    }
  }

  _buildFileMeta(filePath, kind) {
    const ext = path.extname(filePath || '').toLowerCase();
    if (kind === 'trace') {
      return { filename: path.basename(filePath) || 'trace.zip', mime: 'application/zip' };
    }
    if (kind === 'screenshot') {
      const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
        : ext === '.gif' ? 'image/gif'
        : ext === '.webp' ? 'image/webp'
        : 'image/png';
      return { filename: path.basename(filePath) || `screenshot${ext || '.png'}`, mime };
    }
    const mime = ext === '.mp4' ? 'video/mp4'
      : ext === '.mov' ? 'video/quicktime'
      : 'video/webm';
    return { filename: path.basename(filePath) || `video${ext || '.webm'}`, mime };
  }

  async _fileExists(filePath) {
    try {
      await fs.promises.stat(filePath);
      return true;
    } catch {
      return false;
    }
  }

  _idempotencyKey(runId, payload) {
    const raw = `${runId}-${payload.specName}-${payload.testName}-${payload.attempt ?? 0}`;
    return crypto.createHash('sha1').update(raw).digest('hex');
  }
}

module.exports = TesboUploaderV2;

