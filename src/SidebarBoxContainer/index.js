// @flow

import React, { memo } from "react"
import { makeStyles } from "@material-ui/core/styles"
import SidebarBox from "react-material-workspace-layout/SidebarBox"

const useStyles = makeStyles({
  container: {
    "& .panel > *": {
      maxHeight: "100%",
    },
  },
})

export const SidebarBoxContainer = ({
  icon,
  title,
  children,
}) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <SidebarBox icon={icon} title={title}>
        {children}
      </SidebarBox>
    </div>
  )
}

export default memo(
  SidebarBoxContainer,
  (prev, next) => prev.title === next.title && prev.children === next.children
)
