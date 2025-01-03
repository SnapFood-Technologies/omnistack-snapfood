#!/bin/bash

# Array of components (excluding calendar)
components=(
    "accordion"
    "alert"
    "alert-dialog"
    "aspect-ratio"
    "avatar"
    "badge"
    "button"
    "card"
    "checkbox"
    "collapsible"
    "command"
    "context-menu"
    "dialog"
    "dropdown-menu"
    "hover-card"
    "input"
    "label"
    "menubar"
    "navigation-menu"
    "popover"
    "progress"
    "radio-group"
    "scroll-area"
    "select"
    "separator"
    "sheet"
    "skeleton"
    "slider"
    "switch"
    "table"
    "tabs"
    "textarea"
    "toast"
    "toggle"
    "toggle-group"
    "tooltip"
)

# Install each component separately
for component in "${components[@]}"
do
    pnpm dlx @shadcn/ui@latest add "$component"
done
