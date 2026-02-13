// -*- coding: utf-8-unix -*-

import Meta from "gi://Meta";
import Shell from "gi://Shell";

import * as Main from "resource:///org/gnome/shell/ui/main.js";
import {Extension} from "resource:///org/gnome/shell/extensions/extension.js";

export default class CenterWindowKeyExtension extends Extension {

    enable() {
        this._settings = this.getSettings();
        Main.wm.addKeybinding(
            "center-window-key",
            this._settings,
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.ALL,
            this._centerFocusedWindow,
        );
    }

    disable() {
        Main.wm.removeKeybinding("center-window-key");
        this._settings = null;
    }

    _centerFocusedWindow() {
        const window = global.display.get_focus_window();
        if (!window) return;
        if (window.get_window_type() !== Meta.WindowType.NORMAL) return;
        const monitor = window.get_monitor();
        const workArea = global.workspace_manager
              .get_active_workspace()
              .get_work_area_for_monitor(monitor);

        const frame = window.get_frame_rect();
        const newX = workArea.x + Math.floor((workArea.width - frame.width) / 2);
        const newY = workArea.y + Math.floor((workArea.height - frame.height) / 2);
        window.move_frame(true, newX, newY);
    }

}
