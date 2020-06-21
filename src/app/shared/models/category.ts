export interface ICategory {
    Id:             number;
    Name:           string;
    hasSubCategory: boolean;
    CategoryUp:     string;
    parentId:       number;
}
