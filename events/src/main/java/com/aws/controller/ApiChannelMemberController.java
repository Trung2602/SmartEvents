package com.aws.controller;

import com.aws.dto.ChannelMemberDTO;
import com.aws.pojo.ChannelMember;
import com.aws.services.ChannelMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ApiChannelMemberController {

    @Autowired
    private ChannelMemberService channelMemberService;

    // GET: danh sách member theo channel UUID
    @GetMapping("/channel-members/channel/{channelUuid}")
    public ResponseEntity<Page<ChannelMember>> getMembersByChannel(
            @PathVariable UUID channelUuid,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ChannelMember> members = channelMemberService.getChannelMembersByChannelUuid(channelUuid, page, size);
        return ResponseEntity.ok(members);
    }

    // GET: danh sách member theo user UUID
    @GetMapping("/channel-members/user/{userUuid}")
    public ResponseEntity<Page<ChannelMember>> getMembersByUser(
            @PathVariable UUID userUuid,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ChannelMember> members = channelMemberService.getChannelMembersByUserUuid(userUuid, page, size);
        return ResponseEntity.ok(members);
    }

    // GET: danh sách member theo invitation status
    @GetMapping("/channel-members/status/{invitationStatus}")
    public ResponseEntity<Page<ChannelMember>> getMembersByStatus(
            @PathVariable String invitationStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ChannelMember> members = channelMemberService.getChannelMembersByInvitationStatus(invitationStatus, page, size);
        return ResponseEntity.ok(members);
    }

    // POST: tạo hoặc cập nhật member
    @PostMapping("/channel-member")
    public ResponseEntity<ChannelMember> createOrUpdateMember(@RequestBody ChannelMemberDTO member) {
        ChannelMember channelMember = new ChannelMember();
        return ResponseEntity.ok(channelMemberService.addOrUpdateChannelMember(channelMember));
    }

    // DELETE: xóa member theo UUID
    @DeleteMapping("/channel-member-delete/{uuid}")
    public ResponseEntity<?> deleteMember(@PathVariable UUID uuid) {
        ChannelMember member = channelMemberService.findById(uuid);
        if (member != null) {
            channelMemberService.deleteChannelMember(member);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
