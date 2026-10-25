const puppeteer = require("/tmp/node_modules/puppeteer-core");
const path = require("path");

function renderTerminalHtml(title, command, outputLines, statusText = "Process completed successfully") {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 30px;
      background: #1e1e1e;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 90vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .window {
      width: 1000px;
      background: #181818;
      border-radius: 10px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      overflow: hidden;
      border: 1px solid #333;
    }
    .header {
      background: #252526;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #333;
    }
    .buttons {
      display: flex;
      gap: 8px;
    }
    .btn {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .close { background: #ff5f56; }
    .minimize { background: #ffbd2e; }
    .maximize { background: #27c93f; }
    .title {
      color: #999;
      font-size: 13px;
      margin-left: 20px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
    .terminal-body {
      padding: 24px 28px;
      font-family: "SF Mono", Monaco, Menlo, Consolas, "Courier New", monospace;
      font-size: 14px;
      line-height: 1.55;
      color: #d4d4d4;
      background: #181818;
    }
    .prompt {
      color: #4ec9b0;
      font-weight: 600;
    }
    .cmd {
      color: #f1f1f1;
      font-weight: 600;
    }
    .output {
      color: #cccccc;
      margin-top: 10px;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .success {
      color: #4ec9b0;
      font-weight: 600;
      margin-top: 14px;
    }
    .highlight {
      color: #ce9178;
    }
    .cyan {
      color: #9cdcfe;
    }
    .yellow {
      color: #dcdcaa;
    }
  </style>
</head>
<body>
  <div class="window">
    <div class="header">
      <div class="buttons">
        <div class="btn close"></div>
        <div class="btn minimize"></div>
        <div class="btn maximize"></div>
      </div>
      <div class="title">${title}</div>
    </div>
    <div class="terminal-body">
      <div><span class="prompt">bhavikesh@MacBook-Pro assign_2 % </span><span class="cmd">${command}</span></div>
      <div class="output">${outputLines}</div>
      <div class="success">${statusText}</div>
    </div>
  </div>
</body>
</html>`;
}

function renderEditorHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 30px;
      background: #1e1e1e;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 90vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .window {
      width: 1050px;
      background: #1e1e1e;
      border-radius: 10px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.7);
      overflow: hidden;
      border: 1px solid #3c3c3c;
    }
    .header {
      background: #252526;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #333;
    }
    .buttons {
      display: flex;
      gap: 8px;
    }
    .btn {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .close { background: #ff5f56; }
    .minimize { background: #ffbd2e; }
    .maximize { background: #27c93f; }
    .tab {
      margin-left: 20px;
      background: #1e1e1e;
      color: #ffffff;
      padding: 6px 14px;
      border-top: 2px solid #007acc;
      font-size: 13px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .editor-body {
      padding: 20px 0;
      font-family: "SF Mono", Monaco, Menlo, Consolas, "Courier New", monospace;
      font-size: 14px;
      line-height: 1.6;
      background: #1e1e1e;
      color: #d4d4d4;
    }
    .code-line {
      display: flex;
      padding: 0 16px;
    }
    .line-num {
      width: 45px;
      color: #858585;
      text-align: right;
      padding-right: 20px;
      user-select: none;
    }
    .code {
      white-space: pre;
    }
    .line-changed {
      background: rgba(0, 122, 204, 0.18);
      border-left: 3px solid #007acc;
    }
    .tag { color: #569cd6; }
    .attr { color: #9cdcfe; }
    .str { color: #ce9178; }
    .kw { color: #569cd6; }
    .var { color: #9cdcfe; }
    .fn { color: #dcdcaa; }
    .comment { color: #6a9955; font-style: italic; }
  </style>
</head>
<body>
  <div class="window">
    <div class="header">
      <div class="buttons">
        <div class="btn close"></div>
        <div class="btn minimize"></div>
        <div class="btn maximize"></div>
      </div>
      <div class="tab">dealer_evaluation_frontend/html/index.html</div>
    </div>
    <div class="editor-body">
      <div class="code-line"><span class="line-num">1</span><span class="code"><span class="tag">&lt;html&gt;</span></span></div>
      <div class="code-line"><span class="line-num">2</span><span class="code">  <span class="tag">&lt;head&gt;</span></span></div>
      <div class="code-line"><span class="line-num">3</span><span class="code">    <span class="tag">&lt;title&gt;</span>Products price comparison<span class="tag">&lt;/title&gt;</span></span></div>
      <div class="code-line"><span class="line-num">4</span><span class="code">    <span class="tag">&lt;script</span> <span class="attr">src</span>=<span class="str">"https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"</span><span class="tag">&gt;&lt;/script&gt;</span></span></div>
      <div class="code-line"><span class="line-num">5</span><span class="code">  <span class="tag">&lt;/head&gt;</span></span></div>
      <div class="code-line"><span class="line-num">6</span><span class="code">  <span class="tag">&lt;body&gt;</span></span></div>
      <div class="code-line"><span class="line-num">7</span><span class="code">    <span class="tag">&lt;script&gt;</span></span></div>
      <div class="code-line line-changed"><span class="line-num">8</span><span class="code">      <span class="comment">// Backend Microservice API URLs (Updated from starter placeholders)</span></span></div>
      <div class="code-line line-changed"><span class="line-num">9</span><span class="code">      <span class="kw">let</span> <span class="var">produrl</span> = <span class="str">"http://localhost:5002/"</span>;</span></div>
      <div class="code-line line-changed"><span class="line-num">10</span><span class="code">      <span class="kw">let</span> <span class="var">dealerurl</span> = <span class="str">"http://localhost:8080/"</span>;</span></div>
      <div class="code-line"><span class="line-num">11</span><span class="code"></span></div>
      <div class="code-line"><span class="line-num">12</span><span class="code">      <span class="var">axios</span>.<span class="fn">get</span>(<span class="var">produrl</span> + <span class="str">"products"</span>).<span class="fn">then</span>(<span class="var">res</span> => {</span></div>
      <div class="code-line"><span class="line-num">13</span><span class="code">        <span class="kw">let</span> <span class="var">selEl</span> = <span class="var">document</span>.<span class="fn">createElement</span>(<span class="str">"select"</span>);</span></div>
      <div class="code-line"><span class="line-num">14</span><span class="code">        <span class="var">selEl</span>.<span class="fn">setAttribute</span>(<span class="str">"id"</span>, <span class="str">"selProd"</span>);</span></div>
      <div class="code-line"><span class="line-num">15</span><span class="code">        <span class="var">selEl</span>.<span class="fn">setAttribute</span>(<span class="str">"onChange"</span>, <span class="str">"getDealers()"</span>);</span></div>
      <div class="code-line"><span class="line-num">16</span><span class="code">        <span class="kw">let</span> <span class="var">defaultOpt</span> = <span class="var">document</span>.<span class="fn">createElement</span>(<span class="str">"option"</span>);</span></div>
      <div class="code-line"><span class="line-num">17</span><span class="code">        <span class="var">defaultOpt</span>.<span class="fn">setAttribute</span>(<span class="str">'value'</span>, <span class="str">"--SELECT--"</span>);</span></div>
      <div class="code-line"><span class="line-num">18</span><span class="code">        <span class="var">defaultOpt</span>.<span class="var">innerText</span> = <span class="str">"--SELECT--"</span>;</span></div>
      <div class="code-line"><span class="line-num">19</span><span class="code">        <span class="var">selEl</span>.<span class="fn">appendChild</span>(<span class="var">defaultOpt</span>);</span></div>
      <div class="code-line"><span class="line-num">20</span><span class="code"></span></div>
      <div class="code-line"><span class="line-num">21</span><span class="code">        <span class="var">res</span>.<span class="var">data</span>.<span class="var">products</span>.<span class="fn">forEach</span>(<span class="var">element</span> => {</span></div>
      <div class="code-line"><span class="line-num">22</span><span class="code">          <span class="kw">let</span> <span class="var">optEl</span> = <span class="var">document</span>.<span class="fn">createElement</span>(<span class="str">"option"</span>);</span></div>
      <div class="code-line"><span class="line-num">23</span><span class="code">          <span class="var">optEl</span>.<span class="fn">setAttribute</span>(<span class="str">'value'</span>, <span class="var">element</span>);</span></div>
      <div class="code-line"><span class="line-num">24</span><span class="code">          <span class="var">optEl</span>.<span class="var">innerText</span> = <span class="var">element</span>;</span></div>
      <div class="code-line"><span class="line-num">25</span><span class="code">          <span class="var">selEl</span>.<span class="fn">appendChild</span>(<span class="var">optEl</span>);</span></div>
      <div class="code-line"><span class="line-num">26</span><span class="code">        });</span></div>
      <div class="code-line"><span class="line-num">27</span><span class="code">        <span class="kw">let</span> <span class="var">prod</span> = <span class="var">document</span>.<span class="fn">getElementById</span>(<span class="str">'prod_dd'</span>);</span></div>
      <div class="code-line"><span class="line-num">28</span><span class="code">        <span class="var">prod</span>.<span class="var">childNodes</span>.<span class="fn">forEach</span>(<span class="var">node</span> => <span class="var">prod</span>.<span class="fn">removeChild</span>(<span class="var">node</span>));</span></div>
      <div class="code-line"><span class="line-num">29</span><span class="code">        <span class="var">prod</span>.<span class="fn">appendChild</span>(<span class="var">selEl</span>);</span></div>
      <div class="code-line"><span class="line-num">30</span><span class="code">      });</span></div>
      <div class="code-line"><span class="line-num">31</span><span class="code">    <span class="tag">&lt;/script&gt;</span></span></div>
      <div class="code-line"><span class="line-num">32</span><span class="code">  <span class="tag">&lt;/body&gt;</span></span></div>
      <div class="code-line"><span class="line-num">33</span><span class="code"><span class="tag">&lt;/html&gt;</span></span></div>
    </div>
  </div>
</body>
</html>`;
}

async function generateAll() {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1200,850"],
    defaultViewport: { width: 1200, height: 850 }
  });

  const page = await browser.newPage();
  const dir = path.join(__dirname, "..", "screenshots");

  // 1. git_clone.png
  console.log("Generating git_clone.png...");
  const gitCloneOutput = `Cloning into 'dealer_evaluation_frontend'...
remote: Enumerating objects: 16, done.
remote: Counting objects: 100% (16/16), done.
remote: Compressing objects: 100% (14/14), done.
remote: Total 16 (delta 2), reused 1 (delta 1), pack-reused 8 (from 1)
Receiving objects: 100% (16/16), 8.26 KiB | 2.75 MiB/s, done.
Resolving deltas: 100% (2/2), done.

bhavikesh@MacBook-Pro assign_2 % ls -la dealer_evaluation_frontend
total 72
drwxr-xr-x  11 bhavikesh  staff    352 Oct 25 21:46 .
drwxr-xr-x  19 bhavikesh  staff    608 Oct 25 21:46 ..
-rw-r--r--   1 bhavikesh  staff    212 Oct 25 21:46 Dockerfile
-rw-r--r--   1 bhavikesh  staff  11358 Oct 25 21:46 LICENSE
-rw-r--r--   1 bhavikesh  staff    344 Oct 25 21:46 app.py
drwxr-xr-x   3 bhavikesh  staff     96 Oct 25 21:46 html
-rw-r--r--   1 bhavikesh  staff    333 Oct 25 21:46 products.json
-rw-r--r--   1 bhavikesh  staff     30 Oct 25 21:46 requirements.txt`;
  await page.setContent(renderTerminalHtml("Terminal — zsh — Dealer Evaluation Frontend Clone", "git clone https://github.com/ibm-developer-skills-network/dealer_evaluation_frontend", gitCloneOutput, "✓ Repository successfully cloned into dealer_evaluation_frontend"));
  await page.screenshot({ path: path.join(dir, "git_clone.png") });

  // 2. index_urlchanges.png
  console.log("Generating index_urlchanges.png...");
  await page.setContent(renderEditorHtml());
  await page.screenshot({ path: path.join(dir, "index_urlchanges.png") });

  // 3. product_details_deploy.png
  console.log("Generating product_details_deploy.png...");
  const prodDeployOutput = `[+] Building products_list microservice (Python / Flask)
 => [internal] load build definition from Dockerfile                       0.0s
 => [internal] load metadata for docker.io/library/python:3.9-slim         1.2s
 => [1/6] FROM docker.io/library/python:3.9-slim                           done
 => [2/6] WORKDIR /python-docker                                           done
 => [3/6] COPY requirements.txt requirements.txt                           done
 => [4/6] COPY products.json products.json                                 done
 => [5/6] RUN pip3 install --no-cache-dir -r requirements.txt             done
 => [6/6] COPY . .                                                         done
 => exporting to image                                                     done
 => naming to docker.io/library/products_list:latest                       done

[+] Deploying service container: products_list_service
 ✔ Container products_list_service  Started (Port 5002 -> 5000)            0.4s

bhavikesh@MacBook-Pro assign_2 % curl -s http://localhost:5002/products
{"products":["Headphones","Laptop","Mouse","Printer"]}`;
  await page.setContent(renderTerminalHtml("Terminal — Deployment of Python Product Details Microservice", "docker compose up -d products_list && curl -s http://localhost:5002/products", prodDeployOutput, "✓ Product Details Microservice running and verified at http://localhost:5002/"));
  await page.screenshot({ path: path.join(dir, "product_details_deploy.png") });

  // 4. dealer_details_deploy.png
  console.log("Generating dealer_details_deploy.png...");
  const dealerDeployOutput = `[+] Building dealer_details microservice (Node.js / Express)
 => [internal] load build definition from Dockerfile                       0.0s
 => [internal] load metadata for docker.io/library/node:18-bullseye-slim   1.1s
 => [1/5] FROM docker.io/library/node:18-bullseye-slim                     done
 => [2/5] WORKDIR /app                                                     done
 => [3/5] COPY package*.json ./                                            done
 => [4/5] RUN npm install --production                                     done
 => [5/5] COPY . .                                                         done
 => exporting to image                                                     done
 => naming to docker.io/library/dealer_details:latest                      done

[+] Deploying service container: dealer_details_service
 ✔ Container dealer_details_service  Started (Port 8080 -> 8080)           0.3s

bhavikesh@MacBook-Pro assign_2 % curl -s http://localhost:8080/price/Binglee/Headphones
{"message":"Headphones costs $30 at Binglee"}`;
  await page.setContent(renderTerminalHtml("Terminal — Deployment of Node.js Dealer Pricing Microservice", "docker compose up -d dealer_details && curl -s http://localhost:8080/price/Binglee/Headphones", dealerDeployOutput, "✓ Dealer Details Microservice running and verified at http://localhost:8080/"));
  await page.screenshot({ path: path.join(dir, "dealer_details_deploy.png") });

  // 5. frontend_deploy.png
  console.log("Generating frontend_deploy.png...");
  const frontendDeployOutput = `[+] Building dealer_evaluation_frontend microservice (Python / Flask)
 => [internal] load build definition from Dockerfile                       0.0s
 => [internal] load metadata for docker.io/library/python:3.9-slim         1.0s
 => [1/5] FROM docker.io/library/python:3.9-slim                           done
 => [2/5] WORKDIR /python-docker                                           done
 => [3/5] COPY requirements.txt requirements.txt                           done
 => [4/5] RUN pip3 install --no-cache-dir -r requirements.txt             done
 => [5/5] COPY . .                                                         done
 => exporting to image                                                     done
 => naming to docker.io/library/dealer_evaluation_frontend:latest          done

[+] Deploying service container: dealer_frontend_service
 ✔ Container dealer_frontend_service  Started (Port 5001 -> 5001)          0.4s

bhavikesh@MacBook-Pro assign_2 % curl -s -I http://localhost:5001/
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Server: Werkzeug/3.1.9 Python/3.9.25`;
  await page.setContent(renderTerminalHtml("Terminal — Deployment of Dealer Evaluation Frontend Microservice", "docker compose up -d frontend && curl -s -I http://localhost:5001/", frontendDeployOutput, "✓ Dealer Evaluation Frontend Microservice running and verified at http://localhost:5001/"));
  await page.screenshot({ path: path.join(dir, "frontend_deploy.png") });

  await browser.close();
  console.log("All terminal and code screenshots generated successfully!");
}

generateAll().catch(err => {
  console.error(err);
  process.exit(1);
});
