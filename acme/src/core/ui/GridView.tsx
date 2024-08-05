import { Link } from "react-router-dom";
import sofa from '../assets/sofa.jpeg';
import drawer from '../assets/drawer.png';
import toaster from '../assets/toaster.png';

const GridView = () => {
    return <>
        <div className="grid grid-cols-2  grid-rows-1 my-4 gap-4">
            <div className="row-start-1 row-span-2 bg-base-200/55 p-5">
                <div className="text-3xl font-semibold mb-3.5">Living Room</div>
                <Link to={'/products'} className="btn btn-sm btn-link text-slate-600 text-lg font-thin mb-3">Shop now</Link>
                <img src={sofa} alt="sofa" />
            </div>
            <div className="bg-base-200/55 p-5 flex justify-between items-end">
                <div>
                    <div className="text-4xl font-semibold mb-3.5">Bedroom</div>
                    <Link to={'/products'} className="btn btn-sm btn-link text-slate-600 text-lg font-thin mb-3">Shop now</Link>
                </div>
                <img src={drawer} alt="drawer" className="w-3/6" />
            </div>
            <div className="bg-base-200/55 p-5 flex justify-between items-end">
                <div>
                    <div className="text-4xl font-semibold mb-3.5">Kitchen</div>
                    <Link to={'/products'} className="btn btn-sm btn-link text-slate-600 text-lg font-thin mb-3">Shop now</Link>
                </div>
                <img src={toaster} alt="drawer" className="w-3/6" />
            </div>
        </div>
    </>;
};

export default GridView;