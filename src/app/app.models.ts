export class Category {
  constructor(public id: number, 
              public name:string, 
              public hasSubCategory: boolean,
              public parentId: number){ }
}

export class CategoryLevel {
  constructor(public level1: Category[], 
              public level2: Category[],
              public level3: Category[]){ }
}

export interface IPagination {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: IProduct[];
}

export class Pagination implements IPagination {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: IProduct[] = [];
}

export class IProduct {
  constructor(public id: number,
              public name: string,
              public images: Array<any>,
              public oldPrice: number,
              public newPrice: number,
              public discount: number,
              public ratingsCount: number,
              public ratingsValue: number,
              public description: string,
              public technicalDescription: string,
              public additionalInformation: string,
              public availibilityCount: number,
              public cartCount: number,
              public color: Array<string>,
              public size: Array<string>,
              public reviews: Array<any>,
              public weight: number,
              public categoryId: number,
              public brandName: string,
              public categoryName: string,
              public pictureUrl: string){ }
}

export class Product {
  constructor(public id: number,
              public name: string,
              public images: Array<any>,
              public oldPrice: number,
              public newPrice: number,
              public discount: number,
              public ratingsCount: number,
              public ratingsValue: number,
              public description: string,
              public technicalDescription: string,
              public additionalInformation: string,
              public availibilityCount: number,
              public cartCount: number,
              public color: Array<string>,
              public size: Array<string>,
              public reviews: Array<any>,
              public weight: number,
              public categoryId: number,
              public brandName: string,
              public categoryName: string,
              public pictureUrl: string){ }
}

export interface IBrand {
  id: number;
  name: string;
  imageUrl: string;
}