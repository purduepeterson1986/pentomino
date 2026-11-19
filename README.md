# Pentomino

A wooden-tray puzzle for one player, played in any web browser with a mouse, a touch screen or a keyboard. Fit all 12 pentomino pieces into a 6 × 10 tray with no gaps. There are exactly 2,339 different ways to do it, and the game keeps a catalog of every one you find.

**Play it here:** https://purduepeterson1986.github.io/pentomino/

The whole game is in one file, `index.html`. Open it in a browser. There is nothing to install. `manifest.json` and the two icons (`icon-192.png`, `icon-512.png`) let you add it to a phone or iPad home screen, where it opens full screen like an app.

## How to play

1. Choose **Free play** or **Guided**, set the options you like, and press **Start game**.
2. Put pieces in the tray:
   - **Drag** a piece from the side tray onto the board. It snaps to the nearest square where it fits.
   - Or **tap** a piece to pick it up, then **tap a square** on the board to put it there.
3. Turn and flip pieces:
   - **Turn:** tap a selected piece again, press **Turn**, or press **R** (**Shift + R** turns the other way). With a mouse, point at a piece and turn the scroll wheel: down turns it clockwise, up the other way. With no piece under the pointer, the wheel turns the piece you picked up.
   - **Flip:** right-click a piece (or Control-click on a Mac), press **Flip**, or press **F** to turn the piece over.
4. Take a piece back by dragging it off the board, or pressing **Return** (or **Delete**). **Clear** puts every piece back in the tray. **Undo** (or **⌘/Ctrl + Z**) steps back one move.
5. When all 12 pieces fill the tray, the game works out which solution it is (#1 to #2,339):
   - **New solution found!** It goes into your catalog, with the date, your time and the hints you used.
   - **Found before.** The game tells you its number and when you first found it.
6. After solving, press **Keep tinkering** to move pieces and look for another solution. Swapping two or three pieces often makes a new one.

## Game modes

| Mode | What you get |
|---|---|
| **Free play** | An empty tray and all 12 pieces. Build any solution you like. |
| **Guided** | The game picks a solution you haven't found yet and pins some of its pieces in place. You fit the rest around them. |

Guided levels:

| Level | Pinned pieces |
|---|---|
| Beginner | 6 |
| Easy | 5 |
| Medium | 4 |
| Tricky | 3 |
| Hard | 2 |
| Expert | 1 |

Pinned pieces have a brass pin and cannot be moved. You may finish with a different solution from the one the game started from. Any full tray counts.

## Hints

Press **Hint** (or **H**) at any time. The game looks at the pieces already on the board and places one more piece (pinned) that leads to a full solution. It picks a solution you haven't found yet when it can, and in Guided mode it sticks to the puzzle's own solution while that is still possible. Use **Undo** to take a hint back. Hints still count in the hint total for that board.

If the pieces on the board can't lead to any solution, Hint says so instead. The pieces that are in the way flash red: moving any one of them makes the board solvable again.

## Options

- **Live check:** decides whether each new game starts with the **Ways to finish** switch on. The switch sits above the board. While it is on, it shows whether the pieces placed so far can still lead to a solution, and how many solutions are still possible ("37 ways to finish" or "No way to finish"). Tap it, or press **L**, to turn it on or off at any time, for example to peek for a moment and then hide it again. A saved game remembers its own switch.
- **Letters on pieces:** shows each piece's letter name: F, I, L, N, P, T, U, V, W, X, Y, Z.
- **Sound:** wooden clicks when pieces are placed, and a fanfare for each new solution.

## The solution catalog

- Press **Catalog** to see your progress: **X / 2,339** found, with a progress bar.
- The map shows all 2,339 solutions as small squares, #1 at the top left. Found ones are lit gold. Tap a lit square to see that solution.
- Below the map is a picture of every solution you've found, by number or newest first. Tap one to see it larger, and use **Previous** and **Next** to step through them.
- **Reset my catalog** clears your progress (it asks first).

### Backing up your catalog

Your catalog lives in one browser on one device (see [Saving](#saving)). To keep it safe or move it:

- **Back up catalog** saves a small file named like `pentomino-catalog-2026-11-18.json`. It lists every solution you've found, with its number, its board, and when and how you found it. Where it goes depends on the browser:
  - **Chrome and Edge** open a Save window every time, so you pick the folder (iCloud Drive works well).
  - **iPhone and iPad** open the Share sheet. Choose **Save to Files** to pick a folder, or send it by AirDrop or Mail.
  - **Safari and Firefox on a computer** don't let web pages open a Save window, so the file goes to Downloads. The first time, the game explains how to make the browser ask each time. In Safari: **Settings ▸ General ▸ File download location ▸ Ask for each download**.
- **Restore from backup** reads that file in any browser, on any device. It tells you how many of its solutions are new, then adds them to your catalog when you agree. It never removes anything, so restoring the same file twice is harmless. Where both have the same solution, the earlier find date is kept.

Before adding a solution, the game checks that its number still matches its board, so a damaged or edited file can't put wrong entries in your catalog.

### How solutions are numbered

A tray can be turned halfway round or mirrored, top to bottom or left to right. Those copies count as the **same** solution, so each solution has 4 forms. The game lists every solution in its standard form (the first of its 4 forms in alphabetical order, reading the 60 squares row by row as piece letters). It then sorts the list. A solution's place in that sorted list is its permanent number. The numbers never change, so your catalog stays correct.

## Saving

Everything is saved in your browser on this device: your catalog, your settings, and the board you were working on. If you leave in the middle of a puzzle, **Continue** on the start screen picks it up where you left off. Clearing your browser's site data erases the catalog, so use **Back up catalog** now and then. Each browser and each device keeps its own catalog, and the online page and a copy opened from a file count as different sites.

## Screen sizes

The board and tray arrange themselves to fill the screen. On a wide screen the tray sits beside the board. On a tall phone screen the board stands upright (6 squares wide and 10 tall) with the tray underneath. Turn and Flip always act the way they look on screen.

## How it works (for the curious)

When the page opens, the game solves the puzzle itself in about a third of a second, so no list of answers is stored in the file. The X piece goes in first, with its middle somewhere in the top-left quarter of the tray. Every solution has exactly one turned or mirrored form like that, so the search finds each solution exactly once. It then fills the first empty square, column by column, with every piece that fits, and backs up when it gets stuck.

`tests/solver-test.js` checks the solver inside `index.html`. It confirms that:

- a full search finds all 9,356 fillings of the tray,
- these group into exactly 2,339 solutions,
- the fast search gives the identical numbered list,
- every turned or mirrored copy maps back to the same number,
- solution #1 and solution #2,339 have not changed.

Run it on a Mac with:

```bash
/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc tests/solver-test.js -- index.html
```
