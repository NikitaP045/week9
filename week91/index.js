import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import crypto from 'crypto';
import http from 'http';
import m from 'mongoose';
import puppeteer from 'puppeteer'

import CORS from './CORS.js';
import UserModel from './models/User.js';
import appSrc from './app.js';

const User = UserModel(m);
const app = appSrc(express, bodyParser, fs, crypto, http, m, puppeteer, CORS, User);

app.listen(process.env.PORT|| 443);