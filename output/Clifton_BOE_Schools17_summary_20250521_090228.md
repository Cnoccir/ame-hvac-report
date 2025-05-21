# BACnet System Analysis Report - Clifton_BOE_Schools17

Generated: 2025-05-21 09:02:28

## System Overview

- **Jace**: Clifton_BOE_Schools17
- **Total Devices**: 82
- **Total Points**: 5202

## Status Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ok | 1029 | 19.8% |
| stale | 394 | 7.6% |
| down | 64 | 1.2% |
| other | 3715 | 71.4% |

## Trunk Analysis

### Trunk: Default-Trunk

- **Devices**: 82
- **Points**: 5202

#### Device Breakdown

| Device | Points | Point Types | Status |
|--------|--------|-------------|--------|
| HWP_1_VFD | 23 | BacnetBooleanProxyExt: 4, BooleanCovHistoryExt: 4, BacnetNumericProxyExt: 9 | other: 20 (87.0%), down: 3 (13.0%) |
| HWP_2_VFD | 23 | BacnetBooleanProxyExt: 4, BooleanCovHistoryExt: 4, BacnetNumericProxyExt: 9 | other: 20 (87.0%), down: 3 (13.0%) |
| HWS | 81 | BooleanPoint: 18, NumericPoint: 10, EnumWritable: 8 | ok: 22 (27.2%), other: 59 (72.8%) |
| MAU | 19 | BooleanPoint: 3, NumericPoint: 1, NumericWritable: 10 | ok: 3 (15.8%), other: 16 (84.2%) |
| RTU_1 | 96 | NumericPoint: 10, BooleanPoint: 23, NumericWritable: 38 | ok: 21 (21.9%), other: 70 (72.9%), stale: 5 (5.2%) |
| RTU_2 | 94 | NumericPoint: 10, BooleanPoint: 23, NumericWritable: 37 | ok: 21 (22.3%), other: 67 (71.3%), stale: 6 (6.4%) |
| RTU_3 | 68 | NumericPoint: 28, BooleanPoint: 16, BooleanWritable: 6 | stale: 27 (39.7%), ok: 11 (16.2%), other: 30 (44.1%) |
| RTU_4 | 97 | NumericPoint: 12, BooleanPoint: 29, BooleanWritable: 13 | ok: 28 (28.9%), other: 60 (61.9%), stale: 9 (9.3%) |
| RTU_5 | 92 | NumericPoint: 10, BooleanPoint: 25, BooleanWritable: 10 | ok: 23 (25.0%), other: 62 (67.4%), stale: 7 (7.6%) |
| RTU_6 | 63 | NumericPoint: 17, BooleanPoint: 15, Minimum: 1 | stale: 17 (27.0%), ok: 17 (27.0%), other: 29 (46.0%) |
| RTU_7 | 68 | NumericPoint: 21, BooleanPoint: 15, BooleanWritable: 6 | down: 58 (85.3%), other: 5 (7.4%), ok: 5 (7.4%) |
| RTU_8 | 60 | NumericPoint: 16, BooleanPoint: 15, BooleanWritable: 6 | ok: 17 (28.3%), stale: 14 (23.3%), other: 29 (48.3%) |
| TF1 | 23 | NumericPoint: 3, BooleanPoint: 2, NumericWritable: 13 | ok: 4 (17.4%), other: 19 (82.6%) |
| VAV_103_MainOffice | 66 | NumericPoint: 10, NumericWritable: 38, Add: 2 | other: 48 (72.7%), ok: 14 (21.2%), stale: 4 (6.1%) |
| VAV_104_Conf | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 46 (71.9%), ok: 14 (21.9%), stale: 4 (6.2%) |
| VAV_105_Prncpl_Off | 78 | NumericWritable: 45, Add: 2, Subtract: 1 | other: 63 (80.8%), ok: 13 (16.7%), stale: 2 (2.6%) |
| VAV_107_Wrk_rm | 65 | NumericPoint: 10, NumericWritable: 38, Add: 2 | other: 47 (72.3%), ok: 13 (20.0%), stale: 5 (7.7%) |
| VAV_117_Exam_113 | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (72.3%), ok: 14 (21.5%), stale: 4 (6.2%) |
| VAV_118_Kindie_rm | 66 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 49 (74.2%), ok: 13 (19.7%), stale: 4 (6.1%) |
| VAV_121_Kindie_rm | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 13 (20.0%), stale: 4 (6.2%) |
| VAV_125_SpclEd_rm | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 13 (20.0%), stale: 4 (6.2%) |
| VAV_127_Kindie_rm | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 13 (20.0%), stale: 4 (6.2%) |
| VAV_129_Corridor_124 | 58 | NumericPoint: 9, NumericWritable: 33, Add: 2 | other: 42 (72.4%), ok: 12 (20.7%), stale: 4 (6.9%) |
| VAV_131_SpclEd_rm | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 13 (20.0%), stale: 4 (6.2%) |
| VAV_133_Corridor_133 | 58 | NumericPoint: 9, NumericWritable: 33, Add: 2 | other: 42 (72.4%), ok: 12 (20.7%), stale: 4 (6.9%) |
| VAV_134_SpclEd_134 | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 13 (20.0%), stale: 4 (6.2%) |
| VAV_137_SGI | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 13 (20.0%), stale: 4 (6.2%) |
| VAV_141_ClassRm | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 13 (20.0%), stale: 4 (6.2%) |
| VAV_143_ClassRm | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 13 (20.0%), stale: 4 (6.2%) |
| VAV_145_Corridor_145 | 58 | NumericPoint: 9, NumericWritable: 33, Add: 2 | other: 42 (72.4%), ok: 12 (20.7%), stale: 4 (6.9%) |
| VAV_146_ClassRm | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 13 (20.0%), stale: 4 (6.2%) |
| VAV_148_ClassRm | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 13 (20.0%), stale: 4 (6.2%) |
| VAV_152_T55 | 68 | NumericWritable: 36, Add: 2, Subtract: 1 | other: 53 (77.9%), ok: 12 (17.6%), stale: 3 (4.4%) |
| VAV_155_Commons | 58 | NumericPoint: 9, NumericWritable: 33, Add: 2 | other: 42 (72.4%), ok: 12 (20.7%), stale: 4 (6.9%) |
| VAV_159_Storage_158 | 63 | NumericPoint: 9, NumericWritable: 37, Add: 2 | other: 46 (73.0%), ok: 12 (19.0%), stale: 5 (7.9%) |
| VAV_15_ClassRm_201 | 65 | NumericPoint: 11, NumericWritable: 37, Add: 2 | other: 47 (72.3%), stale: 6 (9.2%), ok: 12 (18.5%) |
| VAV_165_Commons_155 | 58 | NumericPoint: 9, NumericWritable: 33, Add: 2 | other: 42 (72.4%), ok: 12 (20.7%), stale: 4 (6.9%) |
| VAV_167_169St | 58 | NumericPoint: 9, NumericWritable: 33, Add: 2 | other: 42 (72.4%), ok: 12 (20.7%), stale: 4 (6.9%) |
| VAV_171_Faculty | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (73.4%), stale: 5 (7.8%), ok: 12 (18.8%) |
| VAV_178_CST | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (72.3%), ok: 14 (21.5%), stale: 4 (6.2%) |
| VAV_179_CST | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (72.3%), ok: 14 (21.5%), stale: 4 (6.2%) |
| VAV_182_Guid | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 46 (71.9%), ok: 13 (20.3%), stale: 5 (7.8%) |
| VAV_185_BookRm | 58 | NumericPoint: 9, NumericWritable: 33, Add: 2 | other: 41 (70.7%), ok: 13 (22.4%), stale: 4 (6.9%) |
| VAV_204_Esl | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 46 (71.9%), ok: 12 (18.8%), stale: 6 (9.4%) |
| VAV_205_ClassRm | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (73.4%), ok: 12 (18.8%), stale: 5 (7.8%) |
| VAV_207_ClassRm | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (73.4%), ok: 12 (18.8%), stale: 5 (7.8%) |
| VAV_209_ClassRm | 67 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (71.6%), ok: 14 (20.9%), stale: 5 (7.5%) |
| VAV_212_ClassRm | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (73.4%), ok: 12 (18.8%), stale: 5 (7.8%) |
| VAV_216_ClassRm | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (73.4%), ok: 12 (18.8%), stale: 5 (7.8%) |
| VAV_218_ClassRm | 68 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 49 (72.1%), ok: 14 (20.6%), stale: 5 (7.4%) |
| VAV_222_ClassRm | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (73.4%), ok: 12 (18.8%), stale: 5 (7.8%) |
| VAV_224_Corridor_224 | 63 | NumericPoint: 9, NumericWritable: 37, Add: 2 | other: 47 (74.6%), ok: 12 (19.0%), stale: 4 (6.3%) |
| VAV_225_ClassRm | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (73.4%), ok: 12 (18.8%), stale: 5 (7.8%) |
| VAV_229_ClassRm | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 12 (18.5%), stale: 5 (7.7%) |
| VAV_231_Corridor | 59 | NumericPoint: 9, NumericWritable: 33, Add: 2 | other: 43 (72.9%), ok: 12 (20.3%), stale: 4 (6.8%) |
| VAV_232_ClassRm | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 12 (18.5%), stale: 5 (7.7%) |
| VAV_236_ClassRm | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (73.4%), ok: 12 (18.8%), stale: 5 (7.8%) |
| VAV_237_Corridor | 58 | NumericPoint: 9, NumericWritable: 33, Add: 2 | other: 42 (72.4%), ok: 12 (20.7%), stale: 4 (6.9%) |
| VAV_238_ClassRm | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (73.4%), ok: 12 (18.8%), stale: 5 (7.8%) |
| VAV_241_ClassRm | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (73.4%), ok: 12 (18.8%), stale: 5 (7.8%) |
| VAV_242_Girls_Toliet | 58 | NumericPoint: 9, NumericWritable: 33, Add: 2 | other: 42 (72.4%), ok: 12 (20.7%), stale: 4 (6.9%) |
| VAV_245_Commons | 58 | NumericPoint: 9, NumericWritable: 33, Add: 2 | other: 41 (70.7%), ok: 12 (20.7%), stale: 5 (8.6%) |
| VAV_248_Art_ClassRm | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (73.4%), ok: 12 (18.8%), stale: 5 (7.8%) |
| VAV_301_Art_ClassRm | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 46 (71.9%), ok: 12 (18.8%), stale: 6 (9.4%) |
| VAV_302_Storage | 58 | NumericPoint: 9, NumericWritable: 33, Add: 2 | other: 42 (72.4%), ok: 12 (20.7%), stale: 4 (6.9%) |
| VAV_303_Special_ED | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 12 (18.5%), stale: 5 (7.7%) |
| VAV_304_ClassRm | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 12 (18.5%), stale: 5 (7.7%) |
| VAV_305_Prac_Rm | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (73.4%), ok: 12 (18.8%), stale: 5 (7.8%) |
| VAV_308_Music | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (73.4%), ok: 12 (18.8%), stale: 5 (7.8%) |
| VAV_309_Prac_Rm | 59 | NumericPoint: 9, NumericWritable: 33, Add: 2 | other: 43 (72.9%), ok: 12 (20.3%), stale: 4 (6.8%) |
| VAV_312_SGI | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 12 (18.5%), stale: 5 (7.7%) |
| VAV_314_SGI | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (73.4%), ok: 12 (18.8%), stale: 5 (7.8%) |
| VAV_318_ClassRm | 65 | NumericPoint: 11, NumericWritable: 36, Add: 2 | other: 47 (72.3%), ok: 12 (18.5%), stale: 6 (9.2%) |
| VAV_319_Corridor | 64 | NumericPoint: 9, NumericWritable: 37, Add: 2 | other: 48 (75.0%), ok: 12 (18.8%), stale: 4 (6.2%) |
| VAV_321_ClassRm | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 12 (18.5%), stale: 5 (7.7%) |
| VAV_323_ClassRm | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 12 (18.5%), stale: 5 (7.7%) |
| VAV_324_Commons_327 | 72 | NumericWritable: 43, Add: 2, Subtract: 1 | other: 58 (80.6%), ok: 12 (16.7%), stale: 2 (2.8%) |
| VAV_327_Corridor_319 | 64 | NumericPoint: 9, NumericWritable: 37, Add: 2 | other: 48 (75.0%), ok: 12 (18.8%), stale: 4 (6.2%) |
| VAV_329_Commons_327 | 59 | NumericPoint: 9, NumericWritable: 33, Add: 2 | other: 43 (72.9%), ok: 12 (20.3%), stale: 4 (6.8%) |
| VAV_331_ResourceRm | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 12 (18.5%), stale: 5 (7.7%) |
| VAV_332_ResourceRm | 64 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 47 (73.4%), ok: 12 (18.8%), stale: 5 (7.8%) |
| VAV_333_ResourceRm | 65 | NumericPoint: 10, NumericWritable: 37, Add: 2 | other: 48 (73.8%), ok: 12 (18.5%), stale: 5 (7.7%) |

