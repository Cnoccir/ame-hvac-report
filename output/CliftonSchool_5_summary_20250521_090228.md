# BACnet System Analysis Report - CliftonSchool_5

Generated: 2025-05-21 09:02:28

## System Overview

- **Jace**: CliftonSchool_5
- **Total Devices**: 31
- **Total Points**: 1928

## Status Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ok | 200 | 10.4% |
| stale | 647 | 33.6% |
| other | 1081 | 56.1% |

## Trunk Analysis

### Trunk: MstpTrunk1

- **Devices**: 2
- **Points**: 161

#### Device Breakdown

| Device | Points | Point Types | Status |
|--------|--------|-------------|--------|
| RTU1 | 80 | NumericPoint: 28, BooleanPoint: 17, NumericWritable: 14 | stale: 54 (67.5%), other: 25 (31.2%), ok: 1 (1.2%) |
| RTU2 | 81 | NumericPoint: 28, BooleanPoint: 17, NumericWritable: 14 | stale: 55 (67.9%), other: 25 (30.9%), ok: 1 (1.2%) |

### Trunk: MstpTrunk2

- **Devices**: 29
- **Points**: 1767

#### Device Breakdown

| Device | Points | Point Types | Status |
|--------|--------|-------------|--------|
| EF_Basement | 20 | BacnetNumericProxyExt: 2, PointTag: 7, BacnetBooleanProxyExt: 5 | stale: 5 (25.0%), ok: 9 (45.0%), other: 6 (30.0%) |
| HWUV_Rm206_EF | 69 | NumericPoint: 7, BooleanPoint: 13, NumericSwitch: 2 | stale: 21 (30.4%), other: 41 (59.4%), ok: 7 (10.1%) |
| SteamBoiler_EFs | 15 | NumericWritable: 6, BooleanPoint: 6, BooleanWritable: 3 | other: 9 (60.0%), stale: 6 (40.0%) |
| UV_Rm101_EF | 63 | NumericPoint: 7, BooleanPoint: 11, NumericSwitch: 2 | stale: 19 (30.2%), other: 37 (58.7%), ok: 7 (11.1%) |
| UV_Rm102_EF | 63 | NumericPoint: 7, BooleanPoint: 11, NumericSwitch: 2 | stale: 19 (30.2%), other: 37 (58.7%), ok: 7 (11.1%) |
| UV_Rm103_EF | 63 | NumericPoint: 7, BooleanPoint: 11, NumericSwitch: 2 | stale: 19 (30.2%), other: 37 (58.7%), ok: 7 (11.1%) |
| UV_Rm104_EF | 63 | NumericPoint: 7, BooleanPoint: 11, NumericSwitch: 2 | stale: 19 (30.2%), other: 37 (58.7%), ok: 7 (11.1%) |
| UV_Rm105_EF | 65 | NumericPoint: 7, BooleanPoint: 13, NumericSwitch: 2 | stale: 21 (32.3%), other: 37 (56.9%), ok: 7 (10.8%) |
| UV_Rm106_EF | 64 | NumericPoint: 7, BooleanPoint: 12, NumericSwitch: 2 | stale: 20 (31.2%), other: 37 (57.8%), ok: 7 (10.9%) |
| UV_Rm107_EF | 63 | NumericPoint: 7, BooleanPoint: 11, NumericSwitch: 2 | stale: 19 (30.2%), other: 37 (58.7%), ok: 7 (11.1%) |
| UV_Rm108_EF | 63 | NumericPoint: 7, BooleanPoint: 11, NumericSwitch: 2 | stale: 19 (30.2%), other: 37 (58.7%), ok: 7 (11.1%) |
| UV_Rm12A_Music_EF | 66 | NumericPoint: 7, BooleanPoint: 11, NumericSwitch: 2 | stale: 19 (28.8%), other: 40 (60.6%), ok: 7 (10.6%) |
| UV_Rm12B_Music_EF | 64 | NumericPoint: 7, BooleanPoint: 11, NumericSwitch: 2 | stale: 19 (29.7%), other: 38 (59.4%), ok: 7 (10.9%) |
| UV_Rm201_EF | 63 | NumericPoint: 7, BooleanPoint: 11, NumericSwitch: 2 | stale: 19 (30.2%), other: 37 (58.7%), ok: 7 (11.1%) |
| UV_Rm202_EF | 63 | NumericPoint: 7, BooleanPoint: 11, NumericSwitch: 2 | stale: 19 (30.2%), other: 37 (58.7%), ok: 7 (11.1%) |
| UV_Rm203_EF | 63 | NumericPoint: 7, BooleanPoint: 11, NumericSwitch: 2 | stale: 19 (30.2%), other: 37 (58.7%), ok: 7 (11.1%) |
| UV_Rm204_EF | 63 | NumericPoint: 7, BooleanPoint: 11, NumericSwitch: 2 | stale: 19 (30.2%), other: 37 (58.7%), ok: 7 (11.1%) |
| UV_Rm205_EF | 64 | NumericPoint: 7, BooleanPoint: 12, NumericSwitch: 2 | stale: 20 (31.2%), other: 37 (57.8%), ok: 7 (10.9%) |
| UV_Rm207_EF | 63 | NumericPoint: 7, BooleanPoint: 11, NumericSwitch: 2 | stale: 19 (30.2%), other: 37 (58.7%), ok: 7 (11.1%) |
| UV_Rm208_EF | 64 | NumericPoint: 7, BooleanPoint: 12, NumericSwitch: 2 | stale: 20 (31.2%), other: 37 (57.8%), ok: 7 (10.9%) |
| UV_Rm209_EF | 65 | NumericPoint: 7, BooleanPoint: 12, NumericSwitch: 2 | stale: 20 (30.8%), other: 38 (58.5%), ok: 7 (10.8%) |
| UV_Rm210_EF | 63 | NumericPoint: 7, BooleanPoint: 11, NumericSwitch: 2 | stale: 19 (30.2%), other: 37 (58.7%), ok: 7 (11.1%) |
| UV_Rm211_EF | 63 | NumericPoint: 7, BooleanPoint: 11, NumericSwitch: 2 | stale: 19 (30.2%), other: 37 (58.7%), ok: 7 (11.1%) |
| UV_Rm212_EF | 65 | NumericPoint: 7, BooleanPoint: 13, NumericSwitch: 2 | stale: 21 (32.3%), other: 37 (56.9%), ok: 7 (10.8%) |
| UV_Rm301_EF | 64 | NumericPoint: 7, BooleanPoint: 12, NumericSwitch: 2 | stale: 20 (31.2%), other: 37 (57.8%), ok: 7 (10.9%) |
| UV_Rm302_EF | 73 | NumericPoint: 9, BooleanPoint: 11, NumericSwitch: 2 | stale: 21 (28.8%), other: 45 (61.6%), ok: 7 (9.6%) |
| UV_Rm303_EF | 63 | NumericPoint: 7, BooleanPoint: 11, NumericSwitch: 2 | stale: 19 (30.2%), other: 37 (58.7%), ok: 7 (11.1%) |
| UV_Rm304_EF | 64 | NumericPoint: 7, BooleanPoint: 12, NumericSwitch: 2 | stale: 20 (31.2%), other: 37 (57.8%), ok: 7 (10.9%) |
| UV_Rm6_Art_EF | 63 | NumericPoint: 7, BooleanPoint: 11, NumericSwitch: 2 | stale: 19 (30.2%), other: 37 (58.7%), ok: 7 (11.1%) |

