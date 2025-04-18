import { ApiError } from '../exceptions/api.error.js';
import * as abonementService from '../services/abonement.service.js';
import { getUserFromRequest } from '../utils/index.js';
export async function getAll(req, res) {
  const user = getUserFromRequest(req);
  if (user.role === 'admin') {
    const abonements = await abonementService.getAll();
    res.send(abonements);
  } else {
    const abonements = await abonementService.getAllByUserId(user.id);
    res.send(abonements);
  }
}

export async function getById(req, res) {
  const abonement = await abonementService.getById(req.params.id);
  if (abonement) {
    res.json(abonement);
  } else {
    throw ApiError.NotFound({ abonement: 'Not found' });
  }
}
export async function update(req, res) {
  const user = getUserFromRequest(req);
  const abonementId = req.params.id;
  const updatedAbonement = await abonementService.update(
    abonementId,
    user,
    req.body,
  );
  res.json(updatedAbonement);
}
export async function create(req, res) {
  const user = getUserFromRequest(req);
  const newAbonement = await abonementService.create(req.body, user);
  res.status(201).json(newAbonement);
}
export async function remove(req, res) {
  const abonementId = req.params.id;
  await abonementService.remove(abonementId);
  res.sendStatus(204);
}
