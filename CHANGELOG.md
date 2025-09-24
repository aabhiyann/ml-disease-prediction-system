## v0.1.1 - 2025-09-24

### Fixed
- Corrected React UI imports in `frontend/src/components/DiseaseFormModern.js` and `HomePageModern.js` to use named exports.
- Resolved invalid element type warnings and improved test stability by aligning test expectations with the modern UI.

### Improved
- Added accessibility label to the remove symptom button in `DiseaseFormModern`.
- Simplified `apiService` to use `axios.get/post` directly for easier testing and maintenance.
- Updated tests to mock axios reliably and to use more robust queries.

### QA
- Frontend test suites: all passing (19 tests).


