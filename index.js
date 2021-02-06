const puppeteer = require("puppeteer");

exports.main = async (req, res) => {
  let canReserveInfo = "";
  await puppeteer
    .launch({
      slowMo: 700,
    })
    .then(async (browser) => {
      const page = await browser.newPage();
      // headless chromeでのconsole.logを出力するようにする
      page.on("console", (consoleObj) => console.log(consoleObj.text()));

      // ゴルフ小屋のWeb予約ページにアクセス
      await page.goto(
        "https://web.star7.jp/reserve_new/mobile_yoyaku_glance.php?p=3c5a0e43e7&nodispheadfoot=1"
      );

      // 菊川店のスクレイピング
      const kikukawa = await page.evaluate(() => {
        const dataList = [];
        // Array.fromで配列に変換
        var rowNumber = 1;
        let date = document.querySelector(
          "#date_parts > div.sch_body > table > thead > tr > td:nth-child(2)"
        );
        if (date !== null) {
          date = date.textContent;
        }
        while (rowNumber !== 0) {
          var node = document.querySelector(
            `#date_parts > div.sch_body > table > tbody > tr:nth-child(${rowNumber}) > td:nth-child(2)`
          );
          if (node === null) {
            // rowNumberに0を設定して繰り返し処理を抜ける
            rowNumber = 0;
          } else {
            const canReserve = node.textContent;
            if (canReserve === "○") {
              const today = !!date ? date : new Date().getDate();
              const time = document.querySelector(
                `#date_parts > div.sch_body > table > tbody > tr:nth-child(${rowNumber}) > td:nth-child(1)`
              ).textContent;
              dataList.push(`菊川店 : ${today} : ${time}`);
            }
            rowNumber++;
          }
        }
        return dataList;
      });

      // 店舗切り替え
      await page.click("#check_staff_10");
      await page.waitForTimeout(1000);

      // 森下店のスクレイピング
      const morishita = await page.evaluate(() => {
        const dataList = [];
        // Array.fromで配列に変換
        var rowNumber = 1;
        let date = document.querySelector(
          "#date_parts > div.sch_body > table > thead > tr > td:nth-child(2)"
        );
        if (date !== null) {
          date = date.textContent;
        }
        while (rowNumber !== 0) {
          var node = document.querySelector(
            `#date_parts > div.sch_body > table > tbody > tr:nth-child(${rowNumber}) > td:nth-child(2)`
          );
          if (node === null) {
            // rowNumberに0を設定して繰り返し処理を抜ける
            rowNumber = 0;
          } else {
            const canReserve = node.textContent;
            if (canReserve === "○") {
              const today = !!date ? date : new Date().getDate();
              const time = document.querySelector(
                `#date_parts > div.sch_body > table > tbody > tr:nth-child(${rowNumber}) > td:nth-child(1)`
              ).textContent;
              dataList.push(`森下店 : ${today} : ${time}`);
            }
            rowNumber++;
          }
        }
        return dataList;
      });

      canReserveInfo = kikukawa.concat(morishita);
      console.log(canReserveInfo);
      browser.close();
    });

  res.status(200).send(canReserveInfo);
};
