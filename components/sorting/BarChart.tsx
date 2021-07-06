import React, { useEffect, useRef } from "react";
import useResize from "../../hooks/useResize";
import classNames from "../../utils/classNames";
import getBarHeight from "../../utils/sorting/getBarHeight";

interface BarChartProps {
  array: number[];
}

const BarChart: React.FC<BarChartProps> = ({ array }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Calculate current width and height with custom hook
  const { width, height } = useResize(ref);

  return (
    <div
      className="flex flex-row mx-auto justify-center items-center w-3/4 h-80"
      ref={ref}
    >
      {array.map((value, index) => {
        // Dynamically calculate the BarChart child dimensions
        const dynamicWidth = `${width / array.length}px`;
        const dynamicMarginX = `${width / array.length / 10}px`;

        const styles = {
          height: getBarHeight(value),
          marginLeft: dynamicMarginX,
          marginRight: dynamicMarginX,
          width: dynamicWidth,
        };

        return (
          <div
            key={index}
            style={styles}
            className={classNames("bg-yellow-300")}
          />
        );
      })}
    </div>
  );
};

export default BarChart;
