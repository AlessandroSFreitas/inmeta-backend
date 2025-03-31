const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

require('dotenv').config();

module.exports = { request, express, mongoose, bcrypt };