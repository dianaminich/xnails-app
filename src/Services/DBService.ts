import { Observer } from "../Abstract/Observer";
import { FirebaseApp } from "firebase/app";
import { User } from "firebase/auth";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { addDoc, collection, doc, Firestore, getDoc, getDocs, getFirestore, orderBy, query, setDoc, Timestamp, where } from "firebase/firestore";
import { TCriteria, TDataBasket, TDataGraph, TDataHistory, TDataUser, TDate, TGood } from "../Abstract/Type";


export class DBService extends Observer {
  private db: Firestore = getFirestore(this.DBFirestore);

  dataUser: TDataUser | null = null;

  dataBasket: TDataBasket = {
    summa: 0,
    percent: 0,
    allSumma: 0
  }

  constructor(private DBFirestore: FirebaseApp) {
    super();
  }

  calcCostGood(count: number, price: number): number {
    const cost = count * price
    return cost;
  }

  calcDataBasket() {
    if (!this.dataUser) return;
    let summa = 0;
    let percent1 = 0;
    let percent2 = 0;
    let percent3 = 0;
    this.dataUser.basket.forEach(el => {//берем каждый элемент корзины
      summa += el.price;
      if (el.type == "маникюр") percent1 = 1;
      if (el.type == "педикюр") percent2 = 1;
      if (el.type == "уходовые процедуры") percent3 = 1;
    });
    const percent = percent1 + percent2 + percent3;
    const percentTotal = percent === 3 ? 7 : percent === 2 ? 5 : 0;

    const allSumma = summa - summa * percentTotal / 100;

    this.dataBasket.allSumma = allSumma;
    this.dataBasket.summa = summa;
    this.dataBasket.percent = percentTotal;
  }


  async getAllDates(): Promise<TDate[]> {
    const q = query(collection(this.db, 'dates'));
    const querySnapshot = await getDocs(q);
    // const storage = getStorage();
    const dates = querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const date = {
        date: data.date as Timestamp,
        id: doc.id
      };
      return date;
    });
    return Promise.all(dates);
  }
  async getAllGoods(criteria: TCriteria): Promise<TGood[]> {
    const crit = [];
    if (criteria.type != 'all') crit.push(where('type', '==', criteria.type));
    if (criteria.price == 'up') {
      crit.push(orderBy('price', "asc"));
    } else {
      crit.push(orderBy("price", 'desc'));
    }
    const q = query(collection(this.db, 'nails'), ...crit);
    const querySnapshot = await getDocs(q);
    const storage = getStorage();
    const goods = querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const uri = ref(storage, data.url);
      const url = await getDownloadURL(uri);
      const good = {
        name: data.name as string,
        price: data.price as number,
        type: data.type as string,
        url: url,
        time: Timestamp.now(),
        id: doc.id
      };
      return good;
    });
    return Promise.all(goods);
  }

  async getDataUser(user: User | null): Promise<void> {
    if (user === null) return;

    const docRef = doc(this.db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.dataUser = docSnap.data() as TDataUser;
    } else {
      const data = {
        email: user.email,
        name: user.displayName,
        fotoUrl: user.photoURL,
        basket: []
      };
      await setDoc(doc(this.db, "users", user.uid), data);
      const docSetSnap = await getDoc(docRef);
      this.dataUser = docSetSnap.data() as TDataUser || null;
      console.log("create documemt");
    }
  }

  async addGoodInBasket(user: User | null, good: TGood): Promise<void> {
    if (!user || !this.dataUser) return;

    const index = this.dataUser.basket.findIndex(el => el.id === good.id);
    if (index >= 0) return;

    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser);

    newUser.basket.push(good);

    await setDoc(doc(this.db, "users", user.uid), newUser)
      .then(() => {
        this.dataUser = newUser;
        this.calcDataBasket();
        this.dispatch('goodInBasket', good);
        this.dispatch('changeDataBasket', this.dataBasket);
      })
      .catch(() => { });
  }
  async addDateInBasket(user: User | null, data: TDate): Promise<void> {
    if (!user || !this.dataUser) return;

    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser);

    newUser.basket.forEach(el => {
      el.time = data.date
    })
    await setDoc(doc(this.db, "users", user.uid), newUser)
      .then(() => {
        this.dataUser = newUser;
        this.dispatch('dateInBasket', data);
      })
      .catch(() => { });
  }
  async delGoodFromBasket(user: User | null, good: TGood): Promise<void> {
    if (!user || !this.dataUser) return;

    const newBasket = this.dataUser.basket.filter((el) => el.id !== good.id);

    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser);
    newUser.basket = newBasket;

    await setDoc(doc(this.db, "users", user.uid), newUser)
      .then(() => {
        this.dataUser = newUser;
        this.calcDataBasket();
        this.dispatch('delGoodFromBasket', good.id);
        this.dispatch('changeDataBasket', this.dataBasket);
      })
      .catch(() => {

      })
  }

  async addBasketInHistory(user: User | null): Promise<void> {
    if (!user || !this.dataUser) return;

    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser)
    newUser.basket = [];

    const dataHistory = {
      basket: this.dataUser.basket,
      dataBasket: this.dataBasket,
      data: Timestamp.now()
    };

    await addDoc(collection(this.db, 'users', user.uid, 'history'), dataHistory)
      .then(async () => {
        await setDoc(doc(this.db, 'users', user.uid), newUser)
          .then(() => {
            if (!this.dataUser) throw "БД отсутствует";
            this.dataUser.basket.forEach((el) => {
              this.dispatch('delBookFromBasket', el.id);
            })
            this.dispatch('addInHistory', dataHistory)
            this.dataUser = newUser;
            this.calcDataBasket();
            this.dispatch('clearBasket');
            this.dispatch('changeDataBasket', this.dataBasket);
            this.calcCountDocsHistory(user);
          })
          .catch(() => { });
      })
      .catch(() => { });
  }

  async calcCountDocsHistory(user: User | null): Promise<void> {
    if (!user || !this.dataUser) return;

    const querySnapshot = await getDocs(collection(this.db, "users", user.uid, "history"));
    const count = querySnapshot.docs.length;
    let summa = 0;
    querySnapshot.docs.forEach(el => {
      summa += el.data().dataBasket.allSumma;
    })
    this.dispatch('changeStat', count, summa);
  }

  async getAllHistory(user: User | null): Promise<TDataHistory[]> {
    if (!user || !this.dataUser) return [];
    const querySnapshot = await getDocs(collection(this.db, 'users', user.uid, 'history'));
    const rez = querySnapshot.docs.map((doc) => {
      const data = doc.data() as TDataHistory;
      data.id = doc.id;
      return data;
    })
    return rez;
  }

  updateDataGraph(histories: TDataHistory[]): TDataGraph[] {
    const data = {} as Record<string, number>;
    histories.forEach((el) => {
      const dataString = el.data.toDate().toDateString();
      if (data[dataString]) {
        data[dataString] += el.dataBasket.allSumma;
      } else {
        data[dataString] = el.dataBasket.allSumma;
      }
    });
    const sortData = [];
    for (const day in data) {
      sortData.push({
        x: new Date(day),
        y: data[day]
      });
    }
    return sortData.sort(
      (a, b) => a.x.getMilliseconds() - b.x.getMilliseconds()
    );
  }
}