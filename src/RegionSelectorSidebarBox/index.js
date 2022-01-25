// @flow

import React, { Fragment, useState, memo, useEffect } from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import { makeStyles, styled } from "@material-ui/core/styles"
import { grey } from "@material-ui/core/colors"
import RegionIcon from "@material-ui/icons/PictureInPicture"
import Grid from "@material-ui/core/Grid"
import CheckIcon from "@material-ui/icons/Check"
import CloseIcon from "@material-ui/icons/Close"
import TrashIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import LockIcon from "@material-ui/icons/Lock"
import UnlockIcon from "@material-ui/icons/LockOpen"
import VisibleIcon from "@material-ui/icons/Visibility"
import VisibleOffIcon from "@material-ui/icons/VisibilityOff"
import styles from "./styles"
import classnames from "classnames"
import isEqual from "lodash/isEqual"
import { Box, Collapse, TextField } from "@material-ui/core"

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
  comment,
  onChangeComment,
  color,
  trash,
  lock,
  visible,
  onClick,
}) => {
  const classes = useStyles()
  const [editing, setEditing] = useState(false)
  const [commentValue, setCommentValue] = useState(comment)

  useEffect(() => {
    setCommentValue(comment)
  }, [comment])

  const handleSaveComment = () => {
    setEditing(false)
    onChangeComment(commentValue)
  }

  const handleCancelComment = () => {
    setEditing(false)
    setCommentValue(comment)
  }

  return (
    <>
      <div
        onClick={onClick}
        className={classnames(classes.row, { header, highlighted })}
      >
        <Grid container alignItems="center">
          <Grid item xs={2}>
            <Chip color={color} text={order} />
          </Grid>
          <Grid item xs={6}>
            <div className="text">{classification}</div>
          </Grid>
          <Grid item xs={1}>
            {!editing && trash}
          </Grid>
          <Grid item xs={1}>
            {!editing && lock}
          </Grid>
          <Grid item xs={1}>
            {!editing && visible}
            {editing && (
              <CloseIcon onClick={handleCancelComment} className="icon2" />
            )}
          </Grid>
          <Grid item xs={1}>
            {!editing && (
              <EditIcon onClick={() => setEditing(true)} className="icon2" />
            )}
            {editing && (
              <CheckIcon onClick={handleSaveComment} className="icon2" />
            )}
          </Grid>
          <Grid item xs={12}>
            {!editing && (
              <div
                className="text"
                style={{ fontWeight: 400, padding: "0 18px" }}
              >
                {commentValue}
              </div>
            )}
          </Grid>
        </Grid>
      </div>
      <Collapse in={editing}>
        <Box>
          <TextField
            multiline
            minRows={2}
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            fullWidth
            inputProps={{
              style: { fontSize: 11, padding: "0 24px", lineHeight: 1.2 },
            }}
            placeholder="Empty"
          />
        </Box>
      </Collapse>
    </>
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
      comment={comment}
      onChangeComment={(newComment) => onChangeRegion({ ...r, comment: newComment })}
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
