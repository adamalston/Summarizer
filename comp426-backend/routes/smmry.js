import express from "express";
import axios from "axios";

export const router = express.Router();
export const prefix = '/smmry';
export const {smmryStore} = require('../data/DataStore');

const smmryURL = axios.create({
    baseURL: "https://api.smmry.com/&SM_API_KEY=9720744B0C&SM_LENGTH=5&SM_URL=",
});

router.post(`/id`, function (req, res) {
    let url = req.body.url;
    console.log(url);
    let obj = Object.keys(smmryStore.get(`id`));
    let id = Math.max(...obj) + 1;
    console.log(id);
    getSmmry(url, id);
    res.send({"data": id});
  });

router.get(`/id`, function (req, res) {
    let id = req.body.id;
    res.send({
        "data": smmryStore.get(`id.${id}`)
    });

});

async function getSmmry(url, id) {
    try {
        const result = await axios.get(`https://api.smmry.com/&SM_API_KEY=9720744B0C&SM_LENGTH=5&SM_URL=${url}`);
        let data = result.data;
        //console.log(result.data);
        smmryStore.set(`id.${id}`, {
            "url": url,
            "data": data,
        });
    } catch (e) {
        console.log("error");
        //$(".summarizeError").show();
    }
}