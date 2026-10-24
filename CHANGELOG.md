# 2026-10-07<main>

### Changed

### Added
- Add page framework：header、main、footer.
- Add font file and four fonts.

### Removed


---


# 2026-10-08<main>

### Changed
- Finish base framework.

### Added
- Add file：./pages/components.jsx
  
### Removed


---


# 2026-10-09<main>

### Changed
- pages 【components】=> drawerSetting / timmingAndNoteEditor

### Added
- Add framework for 【timmingAndNoteEditor】
- Add music play buttom from 【timmingAndNoteEditor】
- Add music control slider from 【timmingAndNoteEditor】
  
### Removed


---


# 2026-10-11<main>

### Changed
- Tidying up【App.jsx】

### Added
- Add【hook.jsk】 / 【hook.css】
- Add【baseEditor.jsx】
- Add music control slider from 【timmingAndNoteEditor】
- Add noteEditor can input someting to boxs by different note Type.
- Add timmingAndNoteEditor can chose different note Type.
- Add timmingAndNoteEditor was maked a slider prepare for stretching track spacing.(拉伸軌道間距)
- 
### Removed


---


# 2026-10-12<main>

### Changed
- 

### Added
- Add ConfigProvider for Antd color (改變antd全域主色調)
- Add【control.js】
- Add baseEditor-Container-Left (notes list)
- Finish baseEditor framework
- baseEditor can input .csv file,and view on baseEditor-Container-Left
- baseEditor can input .mp3 (but can't player)
- offest、start land can read and input (but can't write)

### Removed


---


# 2026-10-12<main>

### Changed
- rotateType = 1 逆時針 ， = 0 順時針

### Added

### Removed


--


# 2026-10-22<editor_write_by_my_self><editor_write_by_my_self>

### Changed

### Added
- editor資料夾 => to write editor by my self

### Removed


--


# 2026-10-24<rhythm_line_drawing_finish><editor_write_by_my_self>

### Changed

### Added
- RhythmLineDrawing
- RotateRhythmLineDrawing

### Removed


--


# 2026-10-25<><editor_write_by_my_self>

### Changed

### Added
- TimmingMarker can run
- Implement audio seeking via 
  - (1.)TimmingMarker
  - (2.)left note column
  - (3.)progress bar(TimmingControl)
- Turn store.js to have 
  - (1.)musicView: change react time number and click view
  - (2.)musicInstance: equal Howler instance, that can use .seek to turn the music reel timming.

### Removed
