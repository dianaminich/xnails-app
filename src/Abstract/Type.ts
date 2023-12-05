import { Timestamp } from "firebase/firestore"
import { AuthService } from "../Services/AuthService"
import { DBService } from "../Services/DBService"
import { LogicService } from "../Services/LogicService"

export type TServices = {
  authService: AuthService,
  logicService: LogicService,
  dbService: DBService
}

export type TGood = {
  name: string,
  price: number,
  type: string,
  url: string,
  id: string,
  time: Timestamp
}
export type TDate = {
  date: Timestamp,
  id: string
}
// export type TGoodBasket = {
//   good: TGood,
//   // date: Timestamp
// }

export type TCriteria = {
  price: string,
  type: string
}

export type TDataUser = {
  name: string,
  fotoUrl: string,
  email: string,
  basket: TGood[]
}
export type TDataBasket = {
  summa: number,
  percent: number,
  allSumma: number
}
export type TDataHistory = {
  basket: TGood[],
  dataBasket: TDataBasket,
  data: Timestamp,
  id: string
}

export type TDataGraph = {
  x: Date,
  y: number,
}
