import type { Box, UserResponse } from "./response.interface";

export interface DayBox {
  dayBoxId?: number;
  idCierre?: number;
  boxId: number;
  totalefectivo?: number;
  totalEfectivo?: number;
  totalTarjeta: number;
  observations: string;
  date: string;
  box?: Box;
  user?: UserResponse;
}

export interface CreateDayBoxDto {
  date: string;
  boxId: number;
  observations: string;
  totalTarjeta: number;
  totalEfectivo: number;
}
