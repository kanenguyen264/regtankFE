export const formatCaseDetail = (data) => {
  return {
    caseId: data?.caseId || "",
    caseName: data?.name || "",
    caseRefId: data?.referenceId || "",
    caseInfo: data?.information || "",
    assignee: data?.assignee || "",
    fields: data.fields || [],
    status: data?.status || "",
  };
};
