resource "kubernetes_service" "clientvaultcrm_redis" {
  metadata {
    name      = "${var.clientvaultcrm_app_name}-redis"
    namespace = kubernetes_namespace.clientvaultcrm.metadata.0.name
  }
  spec {
    selector = {
      app = "${var.clientvaultcrm_app_name}-redis"
    }
    session_affinity = "ClientIP"
    port {
      port        = 6379
      target_port = 6379
    }

    type = "ClusterIP"
  }
}
