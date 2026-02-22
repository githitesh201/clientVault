resource "kubernetes_namespace" "clientvaultcrm" {
  metadata {
    annotations = {
      name = var.clientvaultcrm_namespace
    }

    name = var.clientvaultcrm_namespace
  }
}
