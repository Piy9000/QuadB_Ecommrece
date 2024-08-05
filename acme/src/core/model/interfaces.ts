export interface IProduct {
    id: string;
    productName: string;
    ratings: number;
    price: number;
    isNew: boolean;
    productImagesUrl: string[];
    displayImgUrl: string;
    discount: number;
}