#!/usr/bin/env python3
"""
Generate a simple tooth-shaped STL file for testing
"""
import struct
import math

def create_tooth_stl(filename):
    """Create a simple 3D tooth mesh as STL"""
    
    # Generate tooth vertices and faces
    vertices = []
    faces = []
    
    # Create a simple cylindrical crown with tapered root
    segments = 16
    height_crown = 20
    height_root = 10
    radius_top = 5
    radius_middle = 6
    radius_bottom = 3
    
    # Crown vertices (wider)
    for i in range(segments):
        angle = 2 * math.pi * i / segments
        x = radius_middle * math.cos(angle)
        y = radius_middle * math.sin(angle)
        z = height_crown
        vertices.append((x, y, z))
    
    # Middle vertices (transition)
    for i in range(segments):
        angle = 2 * math.pi * i / segments
        x = radius_middle * math.cos(angle)
        y = radius_middle * math.sin(angle)
        z = height_crown / 2
        vertices.append((x, y, z))
    
    # Root vertices (narrower)
    for i in range(segments):
        angle = 2 * math.pi * i / segments
        x = radius_bottom * math.cos(angle)
        y = radius_bottom * math.sin(angle)
        z = 0
        vertices.append((x, y, z))
    
    # Top cap
    vertices.append((0, 0, height_crown + 2))
    top_idx = len(vertices) - 1
    
    # Bottom root
    vertices.append((0, 0, -2))
    bottom_idx = len(vertices) - 1
    
    # Generate faces for crown (top ring to middle ring)
    for i in range(segments):
        i_next = (i + 1) % segments
        # Triangle 1
        faces.append((i, i_next, i + segments))
        # Triangle 2
        faces.append((i_next, i_next + segments, i + segments))
    
    # Generate faces for root (middle ring to bottom ring)
    for i in range(segments):
        i_next = (i + 1) % segments
        mid_i = i + segments
        mid_i_next = i_next + segments
        root_i = i + 2*segments
        root_i_next = i_next + 2*segments
        
        faces.append((mid_i, mid_i_next, root_i))
        faces.append((mid_i_next, root_i_next, root_i))
    
    # Top cap
    for i in range(segments):
        i_next = (i + 1) % segments
        faces.append((i, top_idx, i_next))
    
    # Bottom cap
    for i in range(segments):
        i_next = (i + 1) % segments
        root_i = i + 2*segments
        root_i_next = i_next + 2*segments
        faces.append((root_i, root_i_next, bottom_idx))
    
    # Write STL file (binary format)
    with open(filename, 'wb') as f:
        # Write 80-byte header
        header = b'Generated Tooth Model' + b' ' * 60
        f.write(header[:80])
        
        # Write number of triangles
        f.write(struct.pack('<I', len(faces)))
        
        # Write each triangle
        for face in faces:
            # Calculate normal
            v0 = vertices[face[0]]
            v1 = vertices[face[1]]
            v2 = vertices[face[2]]
            
            # Edge vectors
            e1 = (v1[0]-v0[0], v1[1]-v0[1], v1[2]-v0[2])
            e2 = (v2[0]-v0[0], v2[1]-v0[1], v2[2]-v0[2])
            
            # Cross product for normal
            nx = e1[1]*e2[2] - e1[2]*e2[1]
            ny = e1[2]*e2[0] - e1[0]*e2[2]
            nz = e1[0]*e2[1] - e1[1]*e2[0]
            
            # Normalize
            length = math.sqrt(nx*nx + ny*ny + nz*nz)
            if length > 0:
                nx /= length
                ny /= length
                nz /= length
            
            # Write normal
            f.write(struct.pack('<fff', nx, ny, nz))
            
            # Write vertices
            for v_idx in face:
                f.write(struct.pack('<fff', vertices[v_idx][0], vertices[v_idx][1], vertices[v_idx][2]))
            
            # Write attribute byte count
            f.write(struct.pack('<H', 0))
    
    print(f"✅ Tooth STL generated: {filename}")

if __name__ == '__main__':
    create_tooth_stl('Dientes3D.stl')
