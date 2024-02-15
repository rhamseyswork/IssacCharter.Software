const supertest = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');

const request = supertest(app);

beforeAll(async () => {
    // Connect to a test database
    const url = 'mongodb+srv://temp-user:AcZHS4cSXgiyAXhj@cluster0.2kwa8tj.mongodb.net/?retryWrites=true&w=majoritynpm';
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    // Cleanup: remove the test user and close the database connection
    await User.deleteMany();
    await mongoose.connection.close();
});

describe("Authentication API", () => {
    it("should create a new user on signup", async () => {
        const response = await request.post('/api/user/signup').send({
            username: "testuser",
            password: "password123"
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.user.username).toBe("testuser");
    });

    it("should login the user", async () => {
        const response = await request.post('/api/user/login').send({
            username: "testuser",
            password: "password123"
        });
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Success');
    });
});
