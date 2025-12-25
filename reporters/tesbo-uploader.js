const fs = require('fs');
const path = require('path');
const { FormData, File, fetch } = require('undici');

class TesboUploader {
  constructor(options = {}) {
    // Optional direct key; falls back to env for backward compatibility.
    this.apiKey = options.apiKey;
    this.apiKeyEnv = options.apiKeyEnv || 'TESBO_API_KEY';
    this.baseUrl = options.baseUrl || 'http://localhost:8080/api';
    this.reportFile = options.reportFile || 'test-results.json';
  }

  async onEnd() {
    const apiKey = this.apiKey || process.env[this.apiKeyEnv];
    if (!apiKey) {
      console.warn(`[tesbo-uploader] Skipping upload: missing apiKey and env ${this.apiKeyEnv}`);
      return;
    }

    const uploadUrl = `${(process.env.TESBO_BASE_URL || this.baseUrl).replace(/\/$/, '')}/ingest/playwright/with-traces`;
    const reportPath = path.resolve(this.reportFile);

    let reportJson;
    try {
      reportJson = JSON.parse(await fs.promises.readFile(reportPath, 'utf-8'));
    } catch (err) {
      console.error(`[tesbo-uploader] Cannot read report at ${reportPath}:`, err.message);
      return;
    }

    // Set a run title so the dashboard shows a meaningful name.
    const runTitle = process.env.TESBO_RUN_TITLE
      || process.env.GITHUB_REF
      || process.env.CI_COMMIT_REF_NAME
      || 'Playwright Run';
    reportJson.metadata = reportJson.metadata || {};
    reportJson.metadata.title = runTitle;
    console.log(`[tesbo-uploader] Run title set to: ${runTitle}`);

    // Log per-test upload intent and which artifacts we found.
    this._emitTestLogs(reportJson);

    const artifacts = [];
    this._rewriteArtifacts(reportJson, artifacts);

    if (artifacts.length === 0) {
      console.warn('[tesbo-uploader] No trace/screenshot/video artifacts found in the report.');
    } else {
      console.log(
        '[tesbo-uploader] Artifacts detected:',
        artifacts.map(a => `${a.kind}:${path.basename(a.filePath)}`).join(', ')
      );
    }

    const form = new FormData();
    form.set('report', JSON.stringify(reportJson));

    for (const { token, filePath, kind } of artifacts) {
      try {
        const buf = await fs.promises.readFile(filePath);
        const { filename, mime } = this._buildFileMeta(filePath, kind);
        // Use append so multiple artifacts from the same test don't overwrite each other.
        form.append(token, new File([buf], filename, { type: mime }));
        console.log(`[tesbo-uploader] Attached ${kind}: ${filePath} as ${filename} (${mime})`);
      } catch (err) {
        console.warn(`[tesbo-uploader] Skipping ${kind} ${filePath}: ${err.message}`);
      }
    }

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'X-API-Key': apiKey },
        body: form
      });
      const body = await response.text();
      if (!response.ok) {
        console.error(`[tesbo-uploader] Upload failed (${response.status}): ${body}`);
      } else {
        console.log(`[tesbo-uploader] Upload succeeded: ${body}`);
      }
    } catch (err) {
      console.error('[tesbo-uploader] Upload error:', err.message);
    }
  }

  _emitTestLogs(reportJson) {
    const walkSuite = (suite, prefix = '') => {
      const suiteTitle = suite?.title || '';
      const suitePrefix = suiteTitle ? (prefix ? `${prefix} > ${suiteTitle}` : suiteTitle) : prefix;

      (suite?.specs || []).forEach(spec => {
        const specTitle = spec?.title || '';
        const specPrefix = specTitle ? (suitePrefix ? `${suitePrefix} > ${specTitle}` : specTitle) : suitePrefix;
        (spec?.tests || []).forEach(test => {
          const testTitle = test?.title || 'Test';
          const fullName = specPrefix ? `${specPrefix} > ${testTitle}` : testTitle;
          console.log(`[tesbo-uploader] Updating data to Tesbo for the test: ${fullName}`);

          const attachments = (test?.results || []).flatMap(r => r?.attachments || []);
          const hasTrace = attachments.some(a => this._detectKind(a?.name || '', a?.contentType || '', a?.path || '') === 'trace');
          const hasScreenshot = attachments.some(a => this._detectKind(a?.name || '', a?.contentType || '', a?.path || '') === 'screenshot');
          const hasVideo = attachments.some(a => this._detectKind(a?.name || '', a?.contentType || '', a?.path || '') === 'video');

          if (hasScreenshot) console.log(`[tesbo-uploader] Screenshot updated for ${fullName}`);
          if (hasTrace) console.log(`[tesbo-uploader] Trace updated for ${fullName}`);
          if (hasVideo) console.log(`[tesbo-uploader] Video updated for ${fullName}`);
        });
      });

      (suite?.suites || []).forEach(child => walkSuite(child, suitePrefix));
    };

    (reportJson?.suites || []).forEach(s => walkSuite(s, ''));
  }

  _rewriteArtifacts(node, artifacts) {
    if (Array.isArray(node)) {
      node.forEach(child => this._rewriteArtifacts(child, artifacts));
      return;
    }
    if (node && typeof node === 'object') {
      const name = (node.name || '').toLowerCase();
      const contentType = (node.contentType || '').toLowerCase();
      const p = node.path;
      if (typeof p === 'string') {
        const kind = this._detectKind(name, contentType, p);
        if (kind) {
          const token = this._inferToken(p, kind);
          artifacts.push({ token, filePath: p, kind });
          node.path = `${kind}://${token}`;
        }
      }
      Object.values(node).forEach(child => this._rewriteArtifacts(child, artifacts));
    }
  }

  _detectKind(name, contentType, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.zip' || contentType.includes('zip') || name.includes('trace')) return 'trace';
    if (contentType.startsWith('image/') || name.includes('screenshot') || ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
      return 'screenshot';
    }
    if (contentType.startsWith('video/') || name.includes('video') || ['.webm', '.mp4', '.mov', '.mkv'].includes(ext)) {
      return 'video';
    }
    return null;
  }

  _buildFileMeta(filePath, kind) {
    const ext = path.extname(filePath).toLowerCase();
    if (kind === 'trace') {
      return { filename: path.basename(filePath) || 'trace.zip', mime: 'application/zip' };
    }
    if (kind === 'screenshot') {
      const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
        : ext === '.gif' ? 'image/gif'
        : ext === '.webp' ? 'image/webp'
        : 'image/png';
      const filename = path.basename(filePath) || `screenshot${ext || '.png'}`;
      return { filename, mime };
    }
    // video
    const mime = ext === '.mp4' ? 'video/mp4'
      : ext === '.mov' ? 'video/quicktime'
      : 'video/webm';
    const filename = path.basename(filePath) || `video${ext || '.webm'}`;
    return { filename, mime };
  }

  _inferToken(filePath, kind) {
    try {
      const dirName = path.basename(path.dirname(filePath));
      const stem = path.basename(filePath).replace(path.extname(filePath), '');
      // Make token unique per artifact to avoid FormData overwrites.
      if (stem) return `${kind}-${stem}`;
      if (dirName) return `${kind}-${dirName}`;
      return `${kind}-${Date.now()}`;
    } catch {
      return `${kind}-${Date.now()}`;
    }
  }
}

module.exports = TesboUploader;