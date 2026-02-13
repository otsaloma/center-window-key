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
            this._centerFocusedWindow.bind(this),
        );
        Main.wm.addKeybinding(
            "center-all-windows-key",
            this._settings,
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.ALL,
            this._centerAllWindows.bind(this),
        );
    }

    disable() {
        Main.wm.removeKeybinding("center-window-key");
        Main.wm.removeKeybinding("center-all-windows-key");
        this._settings = null;
    }

    _centerWindow(window) {
        const monitor = window.get_monitor();
        const workArea = global.workspace_manager
              .get_active_workspace()
              .get_work_area_for_monitor(monitor);

        const frame = window.get_frame_rect();
        const newX = workArea.x + Math.floor((workArea.width - frame.width) / 2);
        const newY = workArea.y + Math.floor((workArea.height - frame.height) / 2);
        window.move_frame(true, newX, newY);
    }

    _centerFocusedWindow() {
        const window = global.display.get_focus_window();
        if (!window) return;
        if (window.get_window_type() !== Meta.WindowType.NORMAL) return;
        this._centerWindow(window);
    }

    _centerAllWindows() {
        const workspace = global.workspace_manager.get_active_workspace();
        for (const window of workspace.list_windows())
            if (window.get_window_type() === Meta.WindowType.NORMAL)
                this._centerWindow(window);
    }

}
