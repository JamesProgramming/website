// A very simple server

const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const home = fs.readFileSync(`${__dirname}/dist/index.html`, "utf-8");
const education = fs.readFileSync(`${__dirname}/dist/education.html`, "utf-8");
const contact = fs.readFileSync(`${__dirname}/dist/contact.html`, "utf-8");
const fourOfour = fs.readFileSync(`${__dirname}/dist/404.html`, "utf-8");

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "images")));

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
