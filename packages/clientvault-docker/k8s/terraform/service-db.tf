resource "kubernetes_service" "clientvaultcrm_db" {
  metadata {
    name      = "${var.clientvaultcrm_app_name}-db"
    namespace = kubernetes_namespace.clientvaultcrm.metadata.0.name
  }
  spec {
    selector = {
      app = "${var.clientvaultcrm_app_name}-db"
    }
    session_affinity = "ClientIP"
    port {
      port        = 5432
      target_port = 5432
    }

    type = "ClusterIP"
  }
}
