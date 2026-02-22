resource "kubernetes_persistent_volume_claim" "docker_data" {
  metadata {
    name      = "${var.clientvaultcrm_app_name}-docker-data-pvc"
    namespace = kubernetes_namespace.clientvaultcrm.metadata.0.name
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = var.clientvaultcrm_docker_data_pvc_requests
      }
    }
    volume_name = kubernetes_persistent_volume.docker_data.metadata.0.name
  }
}
