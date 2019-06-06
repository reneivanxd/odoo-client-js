import { IOdooObjectService } from "../services/odooObjectService";

export interface IOdooModel {
  name: string;
  service: IOdooObjectService;
}

export class OdooModel implements IOdooModel {
  public name: string;
  public service: IOdooObjectService;

  constructor(name: string, service: IOdooObjectService) {
    this.name = name;
    this.service = service;
  }
}
