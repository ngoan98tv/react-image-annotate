// @flow

import React, { Fragment, useState, memo } from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import { makeStyles, styled } from "@material-ui/core/styles"
import { grey } from "@material-ui/core/colors"
import RegionIcon from "@material-ui/icons/PictureInPicture"
import Grid from "@material-ui/core/Grid"
import ReorderIcon from "@material-ui/icons/SwapVert"
import PieChartIcon from "@material-ui/icons/PieChart"
import TrashIcon from "@material-ui/icons/Delete"
import LockIcon from "@material-ui/icons/Lock"
import UnlockIcon from "@material-ui/icons/LockOpen"
import VisibleIcon from "@material-ui/icons/Visibility"
import VisibleOffIcon from "@material-ui/icons/VisibilityOff"
import styles from "./styles"
import classnames from "classnames"
import isEqual from "lodash/isEqual"

const useStyles = makeStyles(styles)

const Chip = ({ color, text }) => {
  const classes = useStyles()
  return (
    <span className={classes.chip}>
      <div className="color" style={{ backgroundColor: color }} />
      <div className="text">{text}</div>
    </span>
  )
}

const RowLayout = ({
  header,
  highlighted,
  order,
  classification,
  area,
  comment,
  color,
  trash,
  lock,
  visible,
  onClick,
}) => {
  const classes = useStyles()
  const [mouseOver, changeMouseOver] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => changeMouseOver(true)}
      onMouseLeave={() => changeMouseOver(false)}
      className={classnames(classes.row, { header, highlighted })}
    >
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Chip color={color} text={order} />
        </Grid>
        <Grid item xs={5}>
          <div className="text">{classification}</div>
        </Grid>
        <Grid item xs={2}>
          <div style={{ textAlign: "right", paddingRight: 6 }}>{area}</div>
        </Grid>
        <Grid item xs={1}>
          {trash}
        </Grid>
        <Grid item xs={1}>
          {lock}
        </Grid>
        <Grid item xs={1}>
          {visible}
        </Grid>
        <Grid item xs={1}>
          <div style={{ visibility: "hidden" }}>#</div>
        </Grid>
        <Grid item xs={10}>
          <div className="text" style={{ fontWeight: 400 }}>
            {comment}
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

const Row = ({
  region: r,
  highlighted,
  onSelectRegion,
  onDeleteRegion,
  onChangeRegion,
  visible,
  locked,
  color,
  cls,
  index,
  comment,
}) => {
  return (
    <RowLayout
      header={false}
      highlighted={highlighted}
      onClick={() => onSelectRegion(r)}
      order={`#${index + 1}`}
      classification={cls || ""}
      color={color || "#ddd"}
      area=""
      comment={comment}
      trash={<TrashIcon onClick={() => onDeleteRegion(r)} className="icon2" />}
      lock={
        r.locked ? (
          <LockIcon
            onClick={() => onChangeRegion({ ...r, locked: false })}
            className="icon2"
          />
        ) : (
          <UnlockIcon
            onClick={() => onChangeRegion({ ...r, locked: true })}
            className="icon2"
          />
        )
      }
      visible={
        r.visible || r.visible === undefined ? (
          <VisibleIcon
            onClick={() => onChangeRegion({ ...r, visible: false })}
            className="icon2"
          />
        ) : (
          <VisibleOffIcon
            onClick={() => onChangeRegion({ ...r, visible: true })}
            className="icon2"
          />
        )
      }
    />
  )
}

const MemoRow = memo(
  Row,
  (prevProps, nextProps) =>
    prevProps.highlighted === nextProps.highlighted &&
    prevProps.visible === nextProps.visible &&
    prevProps.locked === nextProps.locked &&
    prevProps.id === nextProps.id &&
    prevProps.index === nextProps.index &&
    prevProps.cls === nextProps.cls &&
    prevProps.color === nextProps.color &&
    prevProps.comment === nextProps.comment
)

const emptyArr = []

export const RegionSelectorSidebarBox = ({
  regions = emptyArr,
  onDeleteRegion,
  onChangeRegion,
  onSelectRegion,
}) => {
  const classes = useStyles()
  return (
    <SidebarBoxContainer
      title="Regions"
      subTitle=""
      icon={<RegionIcon style={{ color: grey[700] }} />}
      expandedByDefault
    >
      <div className={classes.container}>
        {regions.map((r, i) => (
          <MemoRow
            key={r.id}
            {...r}
            region={r}
            index={i}
            onSelectRegion={onSelectRegion}
            onDeleteRegion={onDeleteRegion}
            onChangeRegion={onChangeRegion}
          />
        ))}
      </div>
    </SidebarBoxContainer>
  )
}

const mapUsedRegionProperties = (r) => [
  r.id,
  r.color,
  r.locked,
  r.visible,
  r.highlighted,
]

export default memo(RegionSelectorSidebarBox, (prevProps, nextProps) =>
  isEqual(
    (prevProps.regions || emptyArr).map(mapUsedRegionProperties),
    (nextProps.regions || emptyArr).map(mapUsedRegionProperties)
  )
)
