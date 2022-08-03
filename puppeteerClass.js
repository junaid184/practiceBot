async function login(userName, password, page) {
  await page.goto("https://www.instagram.com/");
  await page.waitForTimeout(10000);
  await page.type('input[name="username"]', userName, { delay: 200 });
  await page.type('input[name="password"]', password, { delay: 200 }); //write password
  await page.keyboard.press("Enter");
  await page.waitForTimeout(10000);
}
async function openInbox(profile, page) {
  await page.goto(`https://instagram.com/${profile}/`);
  await page.waitForTimeout(10000);
  await page.click('div[class="_aacl _aaco _aacw _aacx _aada _aade"]');
  await page.waitForTimeout(5000);
  await page.click('button[class="_a9-- _a9_1"]');
  await page.waitForTimeout(5000);
}
async function sendMessage(message, page) {
  await page.click('textarea[placeholder="Message..."]');

  await page.keyboard.type(message);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(5000);
}
async function checkMessage(page) {
  const divCount = await page.$$eval(
    'div[class="_ab8w  _ab94 _ab96 _ab9f _ab9k _ab9p _abcm"]',
    (element) => {
      return element.length;
    }
  );
  return divCount;
}
async function checkBye(page) {
  const message = await page.$$(
    `div[class="_ab8w  _ab94 _ab96 _ab9f _ab9k _ab9p _abcm"]`
  );
  // for (let index = 0; index < message.length; index++) {
  //   let element = message[index];
  //   let messageText = await page.evaluate(
  //     (element) => element.textContent,
  //     element
  //   );

  // }
  let last = message.length - 1;
  let element = message[last];
  let messageText = await page.evaluate((element) => {
    return element.textContent;
  }, element);
  return messageText;
}
module.exports = {
  login,
  openInbox,
  sendMessage,
  checkMessage,
  checkBye,
};
