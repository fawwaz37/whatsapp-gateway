import pkg, { downloadContentFromMessage, toBuffer } from "@whiskeysockets/baileys";
import axios from "axios";
import fs from "fs";

const { generateThumbnail, generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg;

class Client {
  constructor(client, target) {
    this.client = client;
    this.from = target;
  }

  async sendText(text) {
    const mentions = [...text.matchAll(/@(\d{0,16})/g)].map((v) => v[1] + "@s.whatsapp.net");
    return await this.client.sendMessage(this.from, { text, mentions });
  }

  async reply(text, quoted) {
    const mentions = [...text.matchAll(/@(\d{0,16})/g)].map((v) => v[1] + "@s.whatsapp.net");
    return await this.client.sendMessage(this.from, { text, mentions }, { quoted });
  }

  async sendProduct(path, body = "", footer = "", businessOwnerJid = "0", options = {}) {
    let image = await prepareWAMessageMedia({ image: { url: path } }, { upload: this.client.waUploadToServer });
    let catalog = await generateWAMessageFromContent(
      this.from,
      proto.Message.fromObject({
        productMessage: {
          product: {
            productImage: image.imageMessage,
            productId: "123",
            title: options.title ? options.title : "",
            description: options.title ? options.title : "",
            currencyCode: options.currencyCode ? options.currencyCode : "IDR",
            footerText: options.title ? options.title : "",
            priceAmount1000: options.price ? options.price : "2000000",
            productImageCount: 1,
            firstImageId: "123",
            salePriceAmount1000: options.salePrice ? options.salePrice : "10000000",
            retailerId: options.retailer ? options.retailer : "",
            url: options.urlProduct ? options.urlProduct : "zekais.com",
          },
          footer,
          body,
          businessOwnerJid: `${businessOwnerJid}@s.whatsapp.net`,
        },
      }),
      { userJid: this.from }
    );
    await this.client.relayMessage(this.from, catalog.message, { messageId: catalog.key.id });
  }

  async sendLocation(lat, long) {
    return await this.client.sendMessage(this.from, { location: { degreesLatitude: lat, degreesLongitude: long } });
  }

  async sendContact(listNumber = [], listName = []) {
    let list = [];
    for (let i = 0; i < listNumber.length; i++) {
      let number = listNumber[i].replace(/[^0-9]/g, "");
      list.push({
        vcard:
          "BEGIN:VCARD\n" +
          "VERSION:3.0\n" +
          `FN:${listName[i]}\n` +
          "ORG:;\n" +
          "TEL;type=CELL;type=VOICE;waid=" +
          number +
          ":+" +
          number +
          "\n" +
          "END:VCARD",
      });
    }
    return await this.client.sendMessage(this.from, { contacts: { displayName: listName[0], contacts: list } });
  }

  async sendSticker(api = false, mime, file, pack, author, keepScale = true, circle = false, removebg = false, quoted = false) {
    const sticker = axios.create({
      baseURL: "https://sticker-api-tpe3wet7da-uc.a.run.app",
    });

    let fixFile = api ? fs.readFileSync(file) : file;

    if (mime == "image") {
      const data = {
        image: `data:image/jpeg;base64,${fixFile.toString("base64")}`,
        stickerMetadata: {
          pack,
          author,
          keepScale,
          circle,
          removebg,
        },
      };
      sticker.post("/prepareWebp", data).then((res) => {
        this.client.sendMessage(this.from, { sticker: Buffer.from(res.data.webpBase64, "base64") }, { quoted });
      });
      if (api) fs.unlinkSync(file);
    } else if (mime == "video") {
      const data = {
        file: `data:video/mp4;base64,${fixFile.toString("base64")}`,
        stickerMetadata: {
          pack,
          author,
          keepScale,
        },
        processOptions: {
          crop: false,
          fps: 10,
          startTime: "00:00:00.0",
          endTime: "00:00:7.0",
          loop: 0,
        },
      };
      sticker.post("/convertMp4BufferToWebpDataUrl", data).then((data) => {
        this.client.sendMessage(this.from, { sticker: Buffer.from(data.data.split(";base64,")[1], "base64") }, { quoted });
      });
      if (api) fs.unlinkSync(file);
    }
  }

  async sendMedia(path, caption = "", options = {}, quoted = "") {
    let mime = options.file.mimetype.split("/")[0];
    const mentions = [...caption.matchAll(/@(\d{0,16})/g)].map((v) => v[1] + "@s.whatsapp.net");
    if (mime == "image" || mime == "video") {
      let jpegThumbnail = await generateThumbnail(path, mime);
      let prepare =
        mime == "image"
          ? { image: { url: path }, caption, mentions, jpegThumbnail, ...options }
          : { video: { url: path }, caption, mentions, jpegThumbnail, ...options };
      const message = await prepareWAMessageMedia(prepare, { upload: this.client.waUploadToServer });
      let msgType = mime == "image" ? { imageMessage: message.imageMessage } : { videoMessage: message.videoMessage };
      let media = await generateWAMessageFromContent(this.from, msgType, { quoted, mediaUploadTimeoutMs: 600000 });
      await this.client.relayMessage(this.from, media.message, { messageId: media.key.id }).catch((error) => console.log(error));
    } else if (mime == "audio") {
      const message = await prepareWAMessageMedia(
        { audio: { url: path }, mimetype: options.file.mimetype, fileName: options.file.name },
        { upload: this.client.waUploadToServer }
      );
      let media = await generateWAMessageFromContent(this.from, { audioMessage: message.audioMessage }, { quoted, mediaUploadTimeoutMs: 600000 });
      await this.client.relayMessage(this.from, media.message, { messageId: media.key.id }).catch((error) => console.log(error));
      await this.client.sendMessage(this.from, { text: caption });
    } else {
      const message = await prepareWAMessageMedia(
        { document: { url: path }, mimetype: options.file.mimetype, fileName: options.file.name },
        { upload: this.client.waUploadToServer }
      );
      let media = await generateWAMessageFromContent(
        this.from,
        { documentMessage: message.documentMessage },
        { quoted, mediaUploadTimeoutMs: 600000 }
      );
      await this.client.relayMessage(this.from, media.message, { messageId: media.key.id }).catch((error) => console.log(error));
      if (caption != "") {
        await this.client.sendMessage(this.from, { text: caption });
      }
    }
  }

  async sendList(text = "", footer = "", title = "", buttonText = "", sections = []) {
    const listMessage = {
      text,
      footer,
      title,
      buttonText,
      sections,
    };
    return await this.client.sendMessage(this.from, listMessage);
  }

  async sendButton(text = "", footer = "", button = [], path = "", mimetype = "", options = {}) {
    const mentions = [...text.matchAll(/@(\d{0,16})/g)].map((v) => v[1] + "@s.whatsapp.net");
    if (path) {
      let mime = mimetype.split("/")[0];
      let thumb = await generateThumbnail(path, mime);
      const message = await prepareWAMessageMedia(
        { image: { url: path }, jpegThumbnail: thumb, ...options },
        { upload: this.client.waUploadToServer }
      );
      let media = generateWAMessageFromContent(
        this.from,
        proto.Message.fromObject({
          templateMessage: {
            hydratedTemplate: {
              imageMessage: message.imageMessage,
              hydratedContentText: text,
              hydratedFooterText: footer,
              hydratedButtons: button,
            },
          },
        }),
        { mediaUploadTimeoutMs: 600000 }
      );
      await this.client.relayMessage(this.from, media.message, { messageId: media.key.id }).catch((error) => console.log(error));
      fs.unlinkSync(path);
    } else {
      const buttonMessage = {
        text,
        footer,
        templateButtons: button,
        headerType: 4,
        mentions,
        viewOnce: true, // Sementara
      };
      return await this.client.sendMessage(this.from, buttonMessage);
    }
  }

  async downloadMedia(msg, pathFile) {
    return new Promise(async (resolve, reject) => {
      try {
        const type = Object.keys(msg)[0];
        const mimeMap = {
          imageMessage: "image",
          videoMessage: "video",
          stickerMessage: "sticker",
          documentMessage: "document",
          audioMessage: "audio",
        };
        const stream = await downloadContentFromMessage(msg[type], mimeMap[type]);
        let buffer = await toBuffer(stream);
        if (pathFile) {
          fs.promises.writeFile(pathFile, buffer).then(resolve(pathFile));
        } else {
          resolve(stream);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default Client;
