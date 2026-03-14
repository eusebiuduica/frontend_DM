import React from "react";
import { Badge, Fab, Tooltip } from "@mui/material";

const SellBadge = ({ gold, onSell }) => {
  return (
    <Badge
      invisible={!gold || gold === 0}
      badgeContent={gold || "0"}
      color="success"
      max={999999}
      sx={{
        position: "fixed",
        top: 80,
        right: 30,
        zIndex: 1000,
      }}
    >
      <Tooltip title="Sell selected cards" arrow placement="left">
        <Fab
          sx={{
            width: 70,
            height: 70,
          }}
          onClick={onSell}
          disabled={!gold || gold === 0}
        >
          <img
            src="/resources/other/iconGold.webp"
            alt="icon"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        </Fab>
      </Tooltip>
    </Badge>
  );
};

export default React.memo(SellBadge);
