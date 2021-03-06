resource "aws_instance" "ose-node-infra" {
  ami                         = "${lookup(var.aws_ami,format("%s-%s",var.operating_system, var.aws_region))}"
  instance_type               = "${var.node_instance_type}"
  vpc_security_group_ids      = ["${aws_security_group.ose.id}"]
  subnet_id                   = "${aws_subnet.main.1.id}"
  key_name                    = "${var.keypair}"
  associate_public_ip_address = "true"
  count                       = "${var.num_node_infra}"

  tags {
    Name          = "${var.cluster_id}-node-infra-${count.index}"
    clusterid     = "${var.cluster_id}"
    created-by    = "${var.cluster_creator}"
    environment   = "${var.cluster_env}"
    host-type     = "node"
    sub-host-type = "infra"
  }

  root_block_device = {
    volume_type = "gp2"
    volume_size = "${var.ebs_root_block_size}"
  }

  user_data = "${data.template_file.user_data.rendered}"
}
