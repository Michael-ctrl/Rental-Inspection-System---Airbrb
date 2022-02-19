import { Box } from "@mui/system";
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import RemoveIcon from "@mui/icons-material/Remove";
import { ItemTypes } from "../../const";
import PropertyCard from "../property/PropertyCard";
import { Button, Grid, Typography } from "@mui/material";
import { format } from "date-fns";

function DraggablePropertyCard({
  property,
  index,
  moveProperty,
  remove,
  times,
}) {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveProperty(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: () => {
      return { id: property.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  drag(drop(ref));
  return (
    <Box
      ref={ref}
      data-handler-id={handlerId}
      sx={{
        opacity: isDragging ? "0" : "1",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {times.length > index && (
        <Typography variant="caption" textAlign="center">{`Arrive at ${format(
          times[index].arriveAt,
          "p"
        )}`}</Typography>
      )}
      <Grid container>
        <Grid item xs={11}>
          <PropertyCard property={property} minify />
        </Grid>
        <Grid item xs={1} sx={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={remove}>
            <RemoveIcon />
          </Button>
        </Grid>
      </Grid>
      <Grid container></Grid>
      {times.length > index && (
        <Typography
          variant="caption"
          sx={{ marginTop: "8px" }}
          textAlign="center"
        >{`Depart at ${format(times[index].departAt, "p")}`}</Typography>
      )}
    </Box>
  );
}

export default DraggablePropertyCard;
