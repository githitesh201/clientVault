resource "kubernetes_service" "clientvaultcrm_server" {
  metadata {
    name      = "${var.clientvaultcrm_app_name}-server"
    namespace = kubernetes_namespace.clientvaultcrm.metadata.0.name
  }
  spec {
    selector = {
      app = "${var.clientvaultcrm_app_name}-server"
    }
    session_affinity = "ClientIP"
    port {
      name        = "http-tcp"
      port        = 3000
      target_port = 3000
    }

    type = "ClusterIP"
  }
}
