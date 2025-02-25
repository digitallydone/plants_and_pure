import { MdWebStories } from "react-icons/md"; 
import { BsMicrosoftTeams } from "react-icons/bs"; 
import { FaUsers } from "react-icons/fa"; 
import { CgTime } from "react-icons/cg";
import React from "react";
import StatCard from "../StatCard";

const Statistics = () => {
  return (
    <div className="w-full bg-foreground">
      <div className="container mx-auto grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<CgTime size={40} />}
          number={8}
          title={"Years in Business"}
        />
        <StatCard
          icon={<MdWebStories size={40} />}
          number={26}
          title={"Projects Completed"}
        />
        <StatCard
          icon={<FaUsers size={40} />}
          number={85}
          title={"Satisfied Clients"}
        />
        <StatCard
          icon={<BsMicrosoftTeams size={40} />}
          number={42}
          title={"Dedicated Team Members"}
        />

      </div>
    </div>
  );
};

export default Statistics;
