import express from "express";
import axios from "axios";
import {parseGet} from "../middlewares/parse_get";
import {parsePost} from "../middlewares/parse_post";

export const router = express.Router();
export const prefix = '/smmry';
export const {smmryStore} = require('../data/DataStore');

const smmryURL = axios.create({
    baseURL: "https://api.smmry.com/&SM_API_KEY=9720744B0C&SM_LENGTH=5&SM_URL=",
});

router.post(`/id`, function (req, res) {
    let url = req.body.url; 
    console.log(url);
    url = url.replace(/^(https?:|)\/\//,'')
    let obj = smmryStore.get(`id`);
    let id = urlExists(url);
    console.log(id)
    console.log("ID in obj: ",id in obj);
    if (!(id in obj)) {
        id = Math.max(...Object.keys(obj)) + 1;
        console.log("new smmry, id: ", id);
        getSmmry(url, id);
    }
    res.send({"data": id});
  });

router.post(`/getID`, function (req, res) {
    let id = req.body.id;
    console.log(id);
    let data = smmryStore.get(`id.${id}`);
    console.log(data)
    res.send({"data": data});
});
  
async function getSmmry(url, id) {
    try {
        const result = await axios.get(`https://api.smmry.com/&SM_API_KEY=9720744B0C&SM_LENGTH=5&SM_URL=${url}`);
        let smmryData = result.data;
        smmryStore.set(`id.${id}`, {
            "url": url,
            "data": smmryData,
        }); 
    } catch (e) {
        console.log("error");
        //$(".summarizeError").show();
    }
}

function urlExists(u) {
    let obj = smmryStore.get(`id`);
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let url = smmryStore.get(`id.${key}.url`);
        if (u == url) {
            console.log(key);
            return key;
        }
    }
    return -1;
}

