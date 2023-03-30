// A very simple server

const compression = require("compression");
const express = require("express");
const { redirectToHTTPS } = require("express-http-to-https");
const fs = require("fs");
const path = require("path");
const app = express();

const replaceURL = (file) => {
  if (false)
    return file.replaceAll(/https:\/\/jamescoolidge.com/g, "http://localhost");
  return file;
};

const home = replaceURL(
  fs.readFileSync(`${__dirname}/dist/index.html`, "utf-8")
);
const education = replaceURL(
  fs.readFileSync(`${__dirname}/dist/education.html`, "utf-8")
);
const contact = replaceURL(
  fs.readFileSync(`${__dirname}/dist/contact.html`, "utf-8")
);
const fourOfour = replaceURL(
  fs.readFileSync(`${__dirname}/dist/404.html`, "utf-8")
);


app.use(compression());
app.use(redirectToHTTPS());

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
  res.status(200).send(home);
});

app.get("/education", (req, res, next) => {
  res.status(200).send(education);
});

app.get("/contact", (req, res, next) => {
  res.status(200).send(contact);
});

app.all("*", (req, res, next) => {
  res.status(404).send(fourOfour);
});

module.exports = app;
