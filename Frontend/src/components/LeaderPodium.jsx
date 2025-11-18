import { motion } from "framer-motion";

function LeaderboardPodium({ leaders }) {
  return (
    <div className="flex justify-center items-end gap-6 mt-6">
      {/* 2nd place on left */}
      {leaders[1] && (
        <PodiumCard leader={leaders[1]} place={2} height="h-44" mt="mt-12" />
      )}
      {/* 1st place in center */}
      {leaders[0] && (
        <PodiumCard leader={leaders[0]} place={1} height="h-60" mt="mt-0" />
      )}
      {/* 3rd place on right */}
      {leaders[2] && (
        <PodiumCard leader={leaders[2]} place={3} height="h-40" mt="mt-20" />
      )}
    </div>
  );
}

function PodiumCard({ leader, place, height, mt }) {
  const podiumColors = {
    1: { bg: "bg-yellow-300", badge: "bg-yellow-400", width: "w-44" },
    2: { bg: "bg-gray-200", badge: "bg-gray-300", width: "w-36" },
    3: { bg: "bg-orange-200", badge: "bg-orange-400", width: "w-32" },
  };

  const { bg, badge, width } = podiumColors[place];

  return (
    <motion.div
      className={`flex flex-col items-center cursor-pointer ${mt}`}
      whileHover={{ scale: 1.05 }}
      onMouseMove={(e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y / rect.height - 0.5) * 20).toFixed(2);
        const rotateY = ((x / rect.width - 0.5) * 20).toFixed(2);
        card.style.transform = `perspective(400px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)";
      }}
      style={{ transition: "transform 0.2s ease-out" }}
    >
      <div className={`${badge} text-black px-4 py-1 rounded-md font-bold`}>
        {place === 1 ? "🥇" : place === 2 ? "🥈" : "🥉"}
      </div>
      <div
        className={`${height} ${width} ${bg} mt-2 rounded-xl flex flex-col justify-center items-center shadow-lg`}
      >
        <p className="font-medium text-lg">{leader.name}</p>
        <p className="text-sm text-muted-foreground">
          {leader.completionRate}%
        </p>
      </div>
    </motion.div>
  );
}

export default LeaderboardPodium;
