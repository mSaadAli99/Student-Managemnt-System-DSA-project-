import { Spinner } from "./ui/spinner";

const CustomLoader = ({ styles }) => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Spinner className={`text-primary ${styles}`} />
    </div>
  );
};

export default CustomLoader;
