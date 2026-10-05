import React from "react";
import OriginalExpandButton from "@theme-original/DocRoot/Layout/Sidebar/ExpandButton";
import type { Props } from "@theme/DocRoot/Layout/Sidebar/ExpandButton";

export default function ExpandButton(props: Props): React.ReactNode {
  // The theme wires this callback to both click and keydown. Tab and arrow keys
  // must leave the collapsed state intact; Enter and Space activate the control.
  function toggleSidebar(event?: React.KeyboardEvent | React.MouseEvent) {
    if (event && "key" in event && event.key !== "Enter" && event.key !== " ")
      return;
    event?.preventDefault();
    props.toggleSidebar();
  }

  return <OriginalExpandButton {...props} toggleSidebar={toggleSidebar} />;
}
