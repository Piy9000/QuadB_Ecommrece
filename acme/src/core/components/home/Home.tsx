import { IProduct } from "../../model/interfaces";
import { Carosel } from "../../model/props";
import CaroselComp from "../../ui/carosel";
import GridView from "../../ui/GridView";
import ProductCarosel from "../../ui/productCarosel";
import sofa from '../../assets/sofa.jpeg';
import { Banknote, LockKeyhole, Phone, Truck } from "lucide-react";

const Home = () => {
    const caroselData: Carosel[] = [
        {
            id: '123',
            imageURL: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
        },
        {
            id: '12',
            imageURL: "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
        },
        {
            id: '13',
            imageURL: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
        },
        {
            id: '23',
            imageURL: "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
        },
    ];

    const products: IProduct[] = [
        {
            id: "1",
            discount: 50,
            displayImgUrl: sofa,
            isNew: true,
            price: 199,
            productImagesUrl: [],
            productName: "Sofa",
            ratings: 5
        }
    ];
    return <>
        <section className="px-40 py-4 border-b border-solid border-base-300">
            <CaroselComp data={caroselData} />
            <div className="my-4 grid grid-cols-2 items-center">
                <div className="font-semibold">
                    <h4 className="text-7xl">Simply Unique<span className="text-slate-500">/</span></h4>
                    <h4 className="text-7xl">Simply Better</h4>
                </div>
                <div className="font-normal text-left text-slate-500 text-lg w-3/4">
                    <span className="font-semibold text-base-content">3legant</span> is a gift & decorations store based in HCMC, Vietnam. Est since 2019.
                </div>
            </div>
        </section>
        <section className="border-b border-solid border-base-200 px-40">
            <GridView />
        </section>

        <section className="px-40 my-4 grid grid-cols-4 gap-3">
            {/* <h4 className="text-4xl font-semibold mb-3">New Arrivals</h4> */}
            {/* <ProductCarosel data={products} /> */}
            <div className="card bg-slate-100 rounded-none">
                <div className="card-body">
                    <Truck className="my-1.5" size={50} strokeWidth={1.25} />
                    <p className="text-lg mb-1.5 font-semibold">Free shipping</p>
                    <p className="mb-1.5 text-sm text-slate-400">Order above $200</p>
                </div>
            </div>
            <div className="card bg-slate-100 rounded-none">
                <div className="card-body">
                    <Banknote className="my-1.5" size={50} strokeWidth={1.25} />
                    <p className="text-lg mb-1.5 font-semibold">Money - back</p>
                    <p className="mb-1.5 text-sm text-slate-400">30 days guarantee</p>
                </div>
            </div>
            <div className="card bg-slate-100 rounded-none">
                <div className="card-body">
                    <LockKeyhole className="my-1.5" size={50} strokeWidth={1.25} />
                    <p className="text-lg mb-1.5 font-semibold">Secure payments</p>
                    <p className="mb-1.5 text-sm text-slate-400">Secure by stripe</p>
                </div>
            </div>
            <div className="card bg-slate-100 rounded-none">
                <div className="card-body">
                    <Phone className="my-1.5" size={50} strokeWidth={1.25} />
                    <p className="text-lg mb-1.5 font-semibold">24/7 Support</p>
                    <p className="mb-1.5 text-sm text-slate-400">Phone and email support</p>
                </div>
            </div>
        </section>

        <section className="w-full grid grid-cols-2">
            <img src="https://s3-alpha-sig.figma.com/img/9f9e/fb2e/4439d804a7b6bed916b72b3bda48939a?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BtDhJ1OwnEr3VtOoUEJBIafMxvYLMQ6kqkbqJ6gheNbjVXV-wSS5ps86gmhe7tPUa51qI9JLjAMBbWkoVin3t6exGUMM~jCd1b3J0RGYMo0~39cF84crW5f9QFwBOTLxv2HazADoKSUfzg-4PftOi9gut1TEU7z58DhSS~fZmnEgJ1gi5QOsAK0YLD7luC4x0uFSdUM7jySKUiSTsvS2567idw3UI3K5EdjdpJVsysaN4cttm2asp7-tgqB5pvpu2xwAEXX5pixsWpQOuFJpudVmruUDDj648kS04UzRuygzxqM7W1U-Lj38XBbjCrXrT5IRbI50DW-BsYvYhPVdCw__" alt="" className="h-2/3 w-full" />
            <div className="bg-slate-100 w-full h-2/3 px-6 py-2.5 flex justify-start items-center">
                <div>
                    <div className="text-blue-600 text-sm uppercase font-semibold mb-3">Sales upto 35% off</div>
                    <p className="text-5xl"><span className="upper">Hundreds</span> of <br /><span>New Lower prices!</span>
                        <br />
                        <p className="font-thin text-sm w-2/3 my-1.5">It’s more affordable than ever to give every room in your home a stylish makeover</p>
                    </p>

                </div>
            </div>
        </section>

    </>;
};
export default Home;