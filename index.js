const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");
const {
  login,
  openInbox,
  sendMessage,
  checkMessage,
  checkBye,
} = require("./puppeteerClass");
const PORT = "3000";
app.get("/", (req, res) => {
  res.send("hello world");
});
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.post("/botstart", async (req, res) => {
  const {
    firstMessage,
    userName,
    msgArray,
    yourUserName,
    yourPassword,
    waitTime,
  } = req.body;
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 10,
    devtools: false,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1024,
    height: 876,
    deviceScaleFactor: 2,
  });
  await login(yourUserName, yourPassword, page);
  await openInbox(userName, page);
  await sendMessage(firstMessage, page);

  const prevCount = await checkMessage(page);
  await page.waitForTimeout(waitTime);
  // if(req.body.timeOut)
  // {
  //   await page.waitForTimeout(req.body.timeOut)
  // }
  // else{
  //   await page.waitForTimeout(waitTime);
  // }
  const againCount = await checkMessage(page);

  if (againCount > prevCount) {
    const bye = await checkBye(page);
    if (bye == "Bye" || bye == "bye") {
      await browser.close();
      res.send("Bye");
    } else {
      for (let i = 0; i <= msgArray.length; i++) {
        await sendMessage(msgArray[i], page);
        let count = await checkMessage(page);
        await page.waitForTimeout(waitTime);
        let newCount = await checkMessage(page);
        if (newCount > count) {
          const bye = await checkBye(page);
          if (bye == "Bye" || bye == "bye") {
            await browser.close();
            res.send("Bye");
            break;
          } else {
            continue;
          }
        } else {
          res.send("no new Msg");
          await browser.close();
          break;
        }
      }
    }
  } else {
    res.send(`no reply`);
    await browser.close();
  }
});
app.listen(PORT, () => {
  console.log(`your server is listening at http://localhost:${PORT}`);
});
