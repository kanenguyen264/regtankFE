// import KYTNoteMock from "__mock/KYTNoteMock";
// import KYCNoteMock from "__mock/KYCNoteMock";
import CaseNoteMock from "__mock/CaseNoteMock";

export default function axiosMock(store) {
  [
    // KYTNoteMock,
    // KYCNoteMock,
    CaseNoteMock
  ].forEach((Class) => {
    new Class(store);
  });
}
