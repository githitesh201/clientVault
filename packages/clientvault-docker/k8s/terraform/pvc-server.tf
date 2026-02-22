resource "kubernetes_persistent_volume_claim" "server" {
  metadata {
    name      = "${var.clientvaultcrm_app_name}-server-pvc"
    namespace = kubernetes_namespace.clientvaultcrm.metadata.0.name
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = var.clientvaultcrm_server_pvc_requests
      }
    }
    volume_name = kubernetes_persistent_volume.server.metadata.0.name
  }
}
