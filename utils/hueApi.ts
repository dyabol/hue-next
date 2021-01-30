import {v3}  from 'node-hue-api';
const hueApi = v3.api;

const USER_NAME = 'vKOnMErOXP05LR-RLFU0WAlC104zaD8Lne2e6kFh';
const ipAddress = '192.168.0.2';

export const getApi = () => {
    return hueApi.createLocal(ipAddress).connect(USER_NAME);
}

export const getLights = async () => {
    const api = await getApi();
    return api.lights.getAll()
}

export default getApi;